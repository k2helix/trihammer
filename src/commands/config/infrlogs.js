const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'infrlogs',
	description: 'Set the infractions logs',
	ESdesc: 'Establece los logs de infracciones',
	usage: 'infrlogs [channel]',
	example: 'infrlogs #channel',
	aliases: ['infraction-logs', 'infrs-logs'],
	type: 3,
	myPerms: [false, 'VIEW_AUDIT_LOG'],
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('ADMINISTRATOR');
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			serverConfig.infrlogs = 'none';
			await serverConfig.save();
			return message.channel.send(':white_check_mark:');
		} else serverConfig.infrlogs = channel.id;
		await serverConfig.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'infractions' }));
	}
};
