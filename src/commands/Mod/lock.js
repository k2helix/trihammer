const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'lock',
	description: 'Lock the current channel',
	ESdesc: 'Bloquea el canal actual',
	usage: 'lock [role]',
	example: 'lock 75412303404822343\nlock',
	cooldown: 5,
	type: 2,
	myPerms: [false, 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { config, mod } = require(`../../utils/lang/${langcode}`);

		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.hasPermission('MANAGE_MESSAGES');
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('MANAGE_MESSAGES');
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((r) => r.name === '@everyone');

		message.channel.createOverwrite(
			role,
			{
				SEND_MESSAGES: false
			},
			`[LOCK] Command used by ${message.author.tag}`
		);
		message.channel.send(mod.channel_lock.replace('{role}', role.name));
	}
};
