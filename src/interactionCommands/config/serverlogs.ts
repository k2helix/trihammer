const { ModelServer } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'serverlogs',
	description: 'Set the server logs',
	ESdesc: 'Establece los logs del servidor',
	usage: 'serverlogs [channel]',
	example: 'serverlogs #channel',
	aliases: ['server-logs'],
	type: 3,
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../lib/utils/lang/${langcode}`);

		let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			serverConfig.serverlogs = 'none';
			await serverConfig.save();
			return message.channel.send(':white_check_mark:');
		} else serverConfig.serverlogs = channel.id;

		await serverConfig.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'server' }));
	}
};