const { ModelServer, ModelLvlRol } = require('../../lib/utils/models');

const Discord = require('discord.js');
module.exports = {
	name: 'leveledroles',
	description: 'See the leveled roles of the server or add more',
	ESdesc: 'Mira o añade los roles de niveles',
	usage: 'leveledroles [remove] <role id> <level>',
	example: 'leveledroles\nleveledroles 408785106942164992 10\n leveledroles remove 408785106942164992 10',
	type: 5,
	async execute(client, interaction, guildConf) {
		let { xp, config } = require(`../../lib/utils/lang/${guildConf.lang}`);

		if (!args[0]) {
			const roles = await ModelLvlRol.find({ server: message.guild.id });
			if (!roles[0]) return message.channel.send(xp.lvlroles.no_roles);

			roles.sort((a, b) => {
				return b.level - a.level;
			});

			const mapa = roles.map((role) => `Level ${role.level}: <@&${role.role}>`).join('\n');
			const embed = new Discord.MessageEmbed();
			embed.setTitle(xp.lvlroles.show);
			embed.setColor('RANDOM');
			embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
			embed.setDescription(mapa);
			message.channel.send({ embeds: [embed] });
		}
		if (args[0] === 'remove') {
			let permiso =
				serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!permiso) return message.channel.send(config.admin_perm);
			if (!args[1] || !args[2]) return message.channel.send(xp.lvlroles.remove);

			await ModelLvlRol.deleteOne({ server: message.guild.id, role: args[1], level: Number(args[2]) });
			message.channel.send(':white_check_mark:');
		}
		if (args[0] && args[0] !== 'remove') {
			let permiso =
				serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
			if (!permiso) return message.channel.send(config.admin_perm);
			let rol = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((r) => r.name === args[0]);
			let nivel = args[1];
			if (!rol || !nivel) return message.channel.send(xp.lvlroles.add);

			let lvlroles = new ModelLvlRol({
				server: message.guild.id,
				role: rol.id,
				level: Number(nivel)
			});
			await lvlroles.validate();
			await lvlroles.save();
			message.channel.send(':white_check_mark:');
		}
	}
};
