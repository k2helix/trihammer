const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'autorole',
	description: 'Set the auto role (the role given to new members)',
	ESdesc: 'Establece el autorol (el rol dado a nuevos miembros)',
	usage: 'autorole <role id or name>',
	example: 'autorole Member',
	aliases: ['auto-role'],
	type: 3,
	myPerms: [false, 'MANAGE_ROLES'],
	async execute(client, message, args) {
		let rol = message.guild.roles.cache.find((r) => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0]);
		if (!rol) return message.channel.send('Error, name or id');
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);
		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('ADMINISTRATOR');
		if (!permiso) return message.channel.send(config.admin_perm);
		serverConfig.autorole = rol.id;
		serverConfig.save();
		message.channel.send(config.role_set.replaceAll({ '{role}': rol.name, '{type}': 'auto' }));
	}
};
