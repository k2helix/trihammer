const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'prefix',
	description: 'Set the prefix of the server',
	ESdesc: 'Establece el prefijo del servidor',
	usage: 'prefix [prefix]',
	example: 'prefix t/',
	aliases: ['setprefix'],
	type: 3,
	async execute(client, message, args) {
		let prefix = args.join(' ');
		if (!prefix) return;
		if (prefix.length > 10) return message.channel.send('No.');
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		serverConfig.prefix = prefix;
		serverConfig.save();
		message.channel.send(config.prefix_set.replace('{prefix}', prefix));
	}
};
