//@ts-nocheck

import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'seek',
	description: 'Jump to a part of the song',
	category: 'music',
	async execute(client, interaction, guildConf) {
		// return interaction.reply({ embeds: [client.redEmbed('Command disabled until YouTube fixes its shit')] });
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;

		const serverQueue = queue.get(interaction.guildId);
		const voiceChannel = interaction.member.voice.channel;
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		if (serverQueue.songs[0]?.id === 'file') return interaction.reply({ embeds: [client.redEmbed(music.cannot_seek_files)], ephemeral: true });

		const array = interaction.options.getString('timestamp')!.split(':').reverse();

		const seconds = parseInt(array[0]);
		const minutes = parseInt(array[1]) * 60;
		// let hours = array[2] ? array[2] * 60 * 60 : 0

		let all = Math.floor(seconds + minutes /*+ Number(hours)*/);
		if (isNaN(all)) return interaction.reply({ embeds: [client.redEmbed('Invalid timestamp')], ephemeral: true });
		if (all >= Number(serverQueue.songs[0].durationInSec)) return interaction.reply({ embeds: [client.redEmbed(music.seek_cancelled)], ephemeral: true });
		if (all === 0) all = 0.05;

		(serverQueue.getResource()!.metadata as { seek: true }) = { seek: true };
		serverQueue.songs[0].seek = all;
		serverQueue.skip(); // force player state change

		interaction.reply({ embeds: [client.blueEmbed(music.seek.replace('{time}', interaction.options.getString('timestamp')!))] });
	}
});
