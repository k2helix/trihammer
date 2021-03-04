const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'antispam',
	description: 'Enable the antispam function',
	ESdesc: 'Activa el sistema antispam',
	usage: 'antispam [disable]',
	example: 'antispam\nantispam disable',
	type: 3,
	myPerms: [false, 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);
		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('ADMINISTRATOR');
		if (!permiso) return message.channel.send(config.admin_perm);

		if (args[0] === 'disable') {
			serverConfig.antispam = false;
			message.channel.send(config.antispam_disabled);
		} else {
			serverConfig.antispam = true;
			message.channel.send(config.antispam_enabled);
		}
		await serverConfig.save();
	}
};
