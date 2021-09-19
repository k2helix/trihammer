const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'clear',
	description: 'Deletes the last 50 messages (or the specified amount)',
	ESdesc: 'Borra los últimos 50 mensajes (o la cantidad especificada)',
	type: 2,
	myPerms: [true, 'MANAGE_MESSAGES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { config, mod } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);
		let amount = isNaN(args[0]) ? 50 : args[0];
		message.channel.messages
			.fetch({ limit: amount > 100 ? 100 : amount })
			.then(function (list) {
				let messageCollection = list.filter((m) => Date.now() - 1123200000 < m.createdTimestamp);
				let messages = [...messageCollection.values()].slice(0, amount);
				if (!messages || !messages[1]) return message.channel.send(mod.bulkDelete_14d);
				message.channel.bulkDelete(messages);
			})
			.catch(function (err) {
				message.channel.send('Error: ' + err);
			});
	}
};
