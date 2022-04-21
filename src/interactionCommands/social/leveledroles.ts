import { LvlRol, ModelLvlRol } from '../../lib/utils/models';
import Discord from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'leveledroles',
	description: 'See the leveled roles of the server or add more',
	category: 'social',
	async execute(client, interaction, guildConf) {
		const { xp, config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!interaction.inCachedGuild() || !interaction.isCommand()) return;

		if (interaction.options.data[0].name === 'view') {
			const roles: LvlRol[] = await ModelLvlRol.find({ server: interaction.guild!.id });
			if (!roles[0]) return interaction.reply({ embeds: [client.redEmbed(xp.lvlroles.no_roles)] });

			roles.sort((a, b) => {
				return b.level - a.level;
			});

			const mapped = roles.map((role) => `Level ${role.level}: <@&${role.role}>`).join('\n');
			const embed = new Discord.MessageEmbed();
			embed.setTitle(xp.lvlroles.show);
			embed.setColor('RANDOM');
			embed.setThumbnail(interaction.guild!.iconURL({ dynamic: true })!);
			embed.setDescription(mapped);
			return interaction.reply({ embeds: [embed] });
		}
		if (interaction.options.data[0].name === 'remove') {
			let perms =
				guildConf.adminrole !== 'none' ? interaction.member.roles.cache.has(guildConf.adminrole) : interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!perms) return interaction.reply({ embeds: [client.redEmbed(config.admin_perm)] });

			await ModelLvlRol.deleteOne({ server: interaction.guild.id, role: interaction.options.getRole('role')!.id, level: parseInt(interaction.options.getString('level')!) });
			return interaction.reply({ embeds: [client.blueEmbed(xp.lvlroles.removed)] });
		}
		if (interaction.options.data[0].name === 'add') {
			let perms =
				guildConf.adminrole !== 'none' ? interaction.member.roles.cache.has(guildConf.adminrole) : interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!perms) return interaction.reply({ embeds: [client.redEmbed(config.admin_perm)] });
			let rol = interaction.options.getRole('role')!;
			let nivel = interaction.options.getString('level');
			if (!rol || !nivel) return interaction.reply({ embeds: [client.redEmbed(xp.lvlroles.add)] });

			let lvlroles = new ModelLvlRol({
				server: interaction.guild.id,
				role: rol.id,
				level: parseInt(nivel)
			});
			await lvlroles.save();
			return interaction.reply({ embeds: [client.blueEmbed(xp.lvlroles.added)] });
		}
	}
});
