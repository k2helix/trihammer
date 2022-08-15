import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { DiscordGatewayAdapterCreator, StreamType, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'stream';
import fetch from 'node-fetch';
export default new MessageCommand({
	name: 'tts',
	description: 'Play a TTS message',
	category: 'music',
	required_args: [{ index: 0, type: 'string', name: 'text' }],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (args.join(' ').length > 200) return message.channel.send({ embeds: [client.redEmbed(music.tts.too_long)] });

		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		const serverQueue = queue.get(message.guildId!);
		if (serverQueue && serverQueue.songs[0]) {
			if (serverQueue.songs[0].id === 'file') return message.channel.send({ embeds: [client.redEmbed(music.tts.file)] });
			serverQueue.songs[0].seek = Math.floor((serverQueue.getPlaybackDuration() + serverQueue.songs[0].seek * 1000) / 1000);
		}
		const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${args.join(' ')}&tl=${guildConf.lang}&total=1&idx=0&client=tw-ob&prev=input&ttsspeed=1`;
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
	}
});
