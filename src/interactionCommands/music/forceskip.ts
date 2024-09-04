import { queue } from '../../lib/modules/music';
import { PermissionsBitField } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'forceskip',
	description: 'Forceskip a song',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		const serverQueue = queue.get(interaction.guildId);
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		if (!serverQueue.playing) return interaction.reply({ embeds: [client.redEmbed(music.not_playing)], ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission =
			interaction.member.roles.cache.has(djRole?.id || '') ||
			interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
			interaction.member.id === serverQueue.songs[0].requested;
		if (permission) {
			serverQueue.skip();
			return interaction.reply({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		} else if (interaction.options.getString('to'))
			if ((djRole && interaction.member!.roles.cache.has(djRole.id)) || serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size <= 3) {
				serverQueue.songs = serverQueue.songs.slice(parseInt(interaction.options.getString('to')!) - 2); // -1 to the array position and another -1 because of the skip
				serverQueue.skip();
				return interaction.reply({ embeds: [client.orangeEmbed(music.skip.skipping)] });
			} else return interaction.reply({ embeds: [client.redEmbed(music.skipto_restricted)], ephemeral: true });
		else return interaction.reply({ embeds: [client.redEmbed(music.need_dj.stop)] });
	}
});
