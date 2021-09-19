const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'actionlogs',
	description: 'Set the action logs',
	ESdesc: 'Establece los logs de acciones',
	usage: 'actionlogs [channel]',
	example: 'actionlogs #channel',
	aliases: ['action-logs'],
	type: 3,
	myPerms: [false, 'VIEW_AUDIT_LOG'],
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			serverConfig.actionslogs = 'none';
			await serverConfig.save();
			return message.channel.send(':white_check_mark:');
		} else serverConfig.actionslogs = channel.id;
		await serverConfig.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'actions' }));
	}
};
