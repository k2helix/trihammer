const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'messagelogs',
	description: 'Set the message logs',
	ESdesc: 'Establece los logs de mensajes',
	usage: 'messagelogs [channel]',
	example: 'messagelogs #channel',
	aliases: ['message-logs'],
	type: 3,
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			serverConfig.messagelogs = 'none';
			await serverConfig.save();
			return message.channel.send(':white_check_mark:');
		} else serverConfig.messagelogs = channel.id;
		await serverConfig.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'messages' }));
	}
};
