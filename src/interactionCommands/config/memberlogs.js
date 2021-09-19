const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'memberlogs',
	description: 'Set the members logs',
	ESdesc: 'Establece los logs de miembros',
	usage: 'memberlogs [channel]',
	example: 'memberlogs #channel',
	aliases: ['member-logs'],
	type: 3,
	myPerms: [false, 'VIEW_AUDIT_LOG'],
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			serverConfig.memberlogs = 'none';
			await serverConfig.save();
			return message.channel.send(':white_check_mark:');
		} else serverConfig.memberlogs = channel.id;
		await serverConfig.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'members' }));
	}
};
