import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { DiscordGatewayAdapterCreator, StreamType, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'stream';
import fetch from 'node-fetch';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'tts',
	description: 'Play a TTS message',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let text = (interaction as ChatInputCommandInteraction).options.getString('text')!;
		let lang = (interaction as ChatInputCommandInteraction).options.getString('language') || guildConf.lang;
		if (text.length > 200) return interaction.reply({ embeds: [client.redEmbed(music.tts.too_long)] });

		const voiceChannel = interaction.member!.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		const serverQueue = queue.get(interaction.guildId!);
		if (serverQueue && serverQueue.songs[0]) {
			if (serverQueue.songs[0].id === 'file') return interaction.reply({ embeds: [client.redEmbed(music.tts.file)] });
			serverQueue.songs[0].seek = Math.floor((serverQueue.getPlaybackDuration() + serverQueue.songs[0].seek * 1000) / 1000);
		}
		const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=${lang}&total=1&idx=0&client=tw-ob&prev=input&ttsspeed=1`;
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
			interaction.reply({ embeds: [client.blueEmbed(music.play.now_playing.tts)] });
		}
	}
});
