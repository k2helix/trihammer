const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'adminrole',
	description: 'Set the admin role',
	ESdesc: 'Establece el rol de administrador',
	usage: 'adminrole [disable] <role id or name>',
	example: 'adminrole staff',
	aliases: ['admin-role'],
	type: 3,
	async execute(client, message, args) {
		let rol = message.guild.roles.cache.find((r) => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0]);
		if (!rol) return message.channel.send('Error, name or id');
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);
		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);

		if (args[0] === 'disable') {
			serverConfig.adminrole = 'none';
			serverConfig.save();
			return message.channel.send(':white_check_mark:');
		}

		serverConfig.adminrole = rol.id;
		serverConfig.save();
		message.channel.send(config.role_set.replaceAll({ '{role}': rol.name, '{type}': 'admin' }));
	}
};
