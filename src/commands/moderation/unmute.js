const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Unmute an user',
	ESdesc: 'Desmutea a un usuario',
	usage: 'unmute <user>',
	example: 'unmute 598894142554243081',
	aliases: ['desmute'],
	type: 2,
	myPerms: [false, 'MANAGE_ROLES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'No';

		if (!member) return message.channel.send(mod.need_id);

		member.roles.remove(
			message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted'),
			`[UNMUTE] Command used by ${message.author.tag} | Reason: ${reason}`
		);
		message.channel.send(mod.infraction.replaceAll({ '{user}': member.user.tag, '{action}': 'unmuted', '{reason}': reason }));

		let infraction = {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔊 UNMUTE',
			time: 'N/A',
			mod: message.author.tag,
			reason: reason,
			guild: message.guild.id
		};

		client.emit('infractionCreate', infraction);
	}
};
