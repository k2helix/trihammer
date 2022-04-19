import { LvlRol, ModelLvlRol } from '../../lib/utils/models';
import Discord from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'leveledroles',
	description: 'See the leveled roles of the server or add more',
	category: 'social',
	required_args: [
		{ index: 0, name: 'remove', type: 'string', optional: true },
		{ index: 0, name: 'role id', type: 'string', optional: true },
		{ index: 0, name: 'level', type: 'number', optional: true }
	],
	async execute(client, message, args, guildConf) {
		const { xp, config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!message.member || !message.guild) return;

		if (!args[0]) {
			const roles: LvlRol[] = await ModelLvlRol.find({ server: message.guild!.id });
			if (!roles[0]) return message.channel.send({ embeds: [client.redEmbed(xp.lvlroles.no_roles)] });

			roles.sort((a, b) => {
				return b.level - a.level;
			});

			const mapped = roles.map((role) => `Level ${role.level}: <@&${role.role}>`).join('\n');
			const embed = new Discord.MessageEmbed();
			embed.setTitle(xp.lvlroles.show);
			embed.setColor('RANDOM');
			embed.setThumbnail(message.guild!.iconURL({ dynamic: true })!);
			embed.setDescription(mapped);
			return message.channel.send({ embeds: [embed] });
		}
		if (args[0] === 'remove') {
			let perms =
				guildConf.adminrole !== 'none' ? message.member.roles.cache.has(guildConf.adminrole) : message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!perms) return message.channel.send({ embeds: [client.redEmbed(config.admin_perm)] });
			if (!args[1] || !args[2]) return message.channel.send({ embeds: [client.redEmbed(xp.lvlroles.remove)] });

			await ModelLvlRol.deleteOne({ server: message.guild.id, role: args[1], level: parseInt(args[2]) });
			return message.channel.send({ embeds: [client.blueEmbed(xp.lvlroles.removed)] });
		}
		if (args[0] !== 'remove') {
			let perms =
				guildConf.adminrole !== 'none' ? message.member.roles.cache.has(guildConf.adminrole) : message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!perms) return message.channel.send({ embeds: [client.redEmbed(config.admin_perm)] });
			let rol = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((r) => r.name === args[0]);
			let nivel = args[1];
			if (!rol || !nivel) return message.channel.send({ embeds: [client.redEmbed(xp.lvlroles.add)] });

			let lvlroles = new ModelLvlRol({
				server: message.guild.id,
				role: rol.id,
				level: parseInt(nivel)
			});
			await lvlroles.save();
			return message.channel.send({ embeds: [client.blueEmbed(xp.lvlroles.added)] });
		}
	}
});
