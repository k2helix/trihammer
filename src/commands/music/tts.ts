import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { DiscordGatewayAdapterCreator, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import Stream from 'stream';
import https from 'https';
export default new MessageCommand({
	name: 'tts',
	description: 'Play a TTS message',
	category: 'music',
	required_args: [
		{ index: 0, type: 'string', name: 'language' },
		{ index: 0, type: 'string', name: 'text' }
	],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (queue.get(message.guild!.id)) return message.channel.send({ embeds: [client.redEmbed(music.tts.queue)] });

		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${args.slice(1).join(' ')}&tl=${args[0]}&total=1&idx=0&client=tw-ob&prev=input&ttsspeed=1`;
		let stream = new Stream.PassThrough();

		// @ts-ignore
		https.get(url, function (response) {
			response.pipe(stream);
		});
		let connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: message.guildId!,
			adapterCreator: message.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator
		});

		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
		const player = createAudioPlayer();
		player.play(resource);
		connection.subscribe(player);

		player.on<'stateChange'>('stateChange', (oldState, newState) => {
			if (oldState.status == 'playing' && newState.status == 'idle') connection.destroy();
		});
	}
});
