const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'modrole',
	description: 'Set the moderator role',
	ESdesc: 'Establece el rol de moderador',
	usage: 'modrole [disable] <role id or name>',
	example: 'modrole Moderator',
	aliases: ['moderator-role'],
	type: 3,
	async execute(client, message, args) {
		let rol = message.guild.roles.cache.find((r) => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0]);
		if (!rol) return message.channel.send('Error, name or id');
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../lib/utils/lang/${langcode}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);

		if (args[0] === 'disable') {
			serverConfig.modrole = 'none';
			serverConfig.save();
			return message.channel.send(':white_check_mark:');
		}

		serverConfig.modrole = rol.id;
		serverConfig.save();
		message.channel.send(config.role_set.replaceAll({ '{role}': rol.name, '{type}': 'mod' }));
	}
};
