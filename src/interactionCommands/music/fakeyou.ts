//@ts-nocheck
import { randomUUID } from 'crypto';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import fetch, { Headers } from 'node-fetch';
import { DiscordGatewayAdapterCreator, StreamType, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'stream';
import Command from '../../lib/structures/Command';
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

export default new Command({
	name: 'fakeyou',
	description: 'Play a TTS message with a voice model from FakeYou',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let text = (interaction as ChatInputCommandInteraction).options.getString('text')!;
		let voice = (interaction as ChatInputCommandInteraction).options.getString('voice')!;

		if (text.length > 200) return interaction.reply({ embeds: [client.redEmbed(music.tts.too_long)] });

		const voiceChannel = interaction.member!.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		// eslint-disable-next-line prettier/prettier
		const model = voiceModels.filter(
			(m) => m.title?.toLowerCase().includes(voice.toLowerCase()) || m.name?.toLowerCase().includes(voice.toLowerCase())
		)[0];

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
					inference_text: text,
					uuid_idempotency_token: randomUUID()
				}),
				headers
			})
				.then((res) => res.json())
				.then((body) => {
					if (!body.success) return interaction.reply({ embeds: [client.redEmbed('An unknown error ocurred')], ephemeral: true });
					interaction.reply({ embeds: [client.loadingEmbed()] });
					let interval = setInterval(() => {
						fetch('https://api.fakeyou.com/tts/job/' + body.inference_job_token, {
							headers
						})
							.then((res) => res.json())
							.then(async (job_body) => {
								if (['complete_success', 'complete_failure', 'dead'].includes(job_body.state.status)) {
									if (job_body.state.status === 'complete_success') {
										const serverQueue = queue.get(interaction.guildId!);
										if (serverQueue && serverQueue.songs[0]) {
											if (serverQueue.songs[0].id === 'file') return interaction.reply({ embeds: [client.redEmbed(music.tts.file)] });
											serverQueue.songs[0].seek = Math.floor((serverQueue.getPlaybackDuration() + serverQueue.songs[0].seek * 1000) / 1000);
										}

										let url = 'https://storage.googleapis.com/vocodes-public' + job_body.state.maybe_public_bucket_wav_audio_path;
										const response = await fetch(url).catch((err) => {
											return client.catchError(interaction.channel, err);
										});
										if (response) {
											let connection =
												getVoiceConnection(interaction.guildId!) ||
												joinVoiceChannel({
													channelId: voiceChannel.id,
													guildId: interaction.guildId!,
													adapterCreator: interaction.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator
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
									} else interaction.reply('The audio could not be generated. Try again');

									clearInterval(interval);
									interaction.editReply({ embeds: [client.blueEmbed(music.play.now_playing.tts)] });
								}
							});
					}, 1000);
				})
				.catch((err) => {
					return client.catchError(interaction.channel, err);
				});
		} catch (error) {
			client.catchError(error, interaction.channel);
		}
	}
});
