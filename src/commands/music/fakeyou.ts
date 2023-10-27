//@ts-nocheck
import { randomUUID } from 'crypto';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import fetch, { Headers } from 'node-fetch';
import { DiscordGatewayAdapterCreator, StreamType, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'stream';
// import fetch from 'node-fetch';

let cookie;
let voiceModels;
fetch('https://api.fakeyou.com/tts/list')
	.then((res) => res.text())
	.then((body) => {
		voiceModels = JSON.parse(body).models;
	});

// https://gist.github.com/jack3898/3b96e05c5ee11e00877f85378bd1d14c
if (process.env.FAKEYOU_USERNAME && process.env.FAKEYOU_PASSWORD)
	fetch('https://api.fakeyou.com/login', {
		method: 'POST',
		body: JSON.stringify({
			username_or_email: process.env.FAKEYOU_USERNAME,
			password: process.env.FAKEYOU_PASSWORD
		}),
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
	})
		.then((response) => {
			cookie = response.headers
				.get('set-cookie')
				?.match(/^\w+.=([^;]+)/)
				?.at(1);
		})
		.catch((error) => {
			console.log(error);
		});

export default new MessageCommand({
	name: 'fakeyou',
	description: 'Play a TTS message with a voice model from FakeYou',
	category: 'music',
	aliases: ['fy'],
	required_args: [
		{ index: 0, type: 'string', name: 'voice' },
		{ index: 1, type: 'string', name: 'text' }
	],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		if (args.slice(1).join(' ').length > 200) return message.channel.send({ embeds: [client.redEmbed(music.tts.too_long)] });

		// eslint-disable-next-line prettier/prettier
		const model = voiceModels.filter(
			(m) => m.title?.toLowerCase().includes(args[0].toLowerCase()) || m.name?.toLowerCase().includes(args[0].toLowerCase())
		)[0];

		if (!model) return message.channel.send({ embeds: [client.redEmbed(music.tts.fakeyou_not_found.replace('{voice}', args[0]))] });

		try {
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');
			headers.append('Accept', 'application/json');

			if (process.env.FAKEYOU_USERNAME && process.env.FAKEYOU_PASSWORD) {
				headers.append('credentials', 'include'); // IMPORTANT! Your cookie will not be sent without this!
				headers.append('cookie', `session=${cookie}`); // Add the cookie
			}

			fetch('https://api.fakeyou.com/tts/inference', {
				method: 'post',
				body: JSON.stringify({
					tts_model_token: model.model_token,
					inference_text: args.slice(1).join(' '),
					uuid_idempotency_token: randomUUID()
				}),
				headers
			})
				.then((res) => res.json())
				.then(async (body) => {
					if (!body.success) return message.channel.send('An unknown error ocurred.');
					let msg = await message.channel.send({ embeds: [client.loadingEmbed()] });
					let interval = setInterval(() => {
						fetch('https://api.fakeyou.com/tts/job/' + body.inference_job_token, {
							headers
						})
							.then((res) => res.json())
							.then(async (job_body) => {
								if (['complete_success', 'complete_failure', 'dead'].includes(job_body.state.status)) {
									if (job_body.state.status === 'complete_success') {
										const serverQueue = queue.get(message.guildId!);
										if (serverQueue && serverQueue.songs[0]) {
											if (serverQueue.songs[0].id === 'file') return message.channel.send({ embeds: [client.redEmbed(music.tts.file)] });
											serverQueue.songs[0].seek = Math.floor((serverQueue.getPlaybackDuration() + serverQueue.songs[0].seek * 1000) / 1000);
										}

										let url = 'https://storage.googleapis.com/vocodes-public' + job_body.state.maybe_public_bucket_wav_audio_path;
										const response = await fetch(url).catch((err) => {
											return client.catchError(message.channel, err);
										});
										if (response) {
											let connection =
												getVoiceConnection(message.guildId!) ||
												joinVoiceChannel({
													channelId: voiceChannel.id,
													guildId: message.guildId!,
													adapterCreator: message.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator
												});

											const resource = createAudioResource(response.body as Readable, { inputType: StreamType.Arbitrary, metadata: { seek: true } });
											const player = serverQueue?.getPlayer() || createAudioPlayer();
											player.play(resource);

											if (!serverQueue) {
												connection.subscribe(player);
												player.on('stateChange', (oldState, newState) => {
													if (oldState.status == 'playing' && newState.status == 'idle') connection.destroy();
												});
											}
										}
									} else message.channel.send('The audio could not be generated. Try again');

									clearInterval(interval);
									msg.delete();
								}
							});
					}, 1000);
				})
				.catch((err) => {
					return client.catchError(message.channel, err);
				});
		} catch (error) {
			client.catchError(error, message.channel);
		}
	}
});
