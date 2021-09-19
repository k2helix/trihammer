const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'cleanuser',
	description: 'Deletes the last x messages of the given user',
	ESdesc: 'Borra los últimos x mensajes del usuario dado',
	usage: 'cleanuser <user> [amount]',
	example: 'cleanuser 353696439358193664 10',
	aliases: ['userclean', 'clean', 'clean-user'],
	type: 2,
	myPerms: [true, 'MANAGE_MESSAGES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { config, mod } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!user) return message.channel.send(mod.whose_messages);

		var amount = args[1];
		if (!amount) amount = '100';

		message.channel.messages
			.fetch({
				limit: Number(amount) > 100 ? 100 : Number(amount)
			})
			.then((list) => {
				const filterBy = user ? user.id : client.user.id;
				let messageCollection = list.filter((m) => m.author.id === filterBy && Date.now() - 1123200000 < m.createdTimestamp);
				let messages = [...messageCollection.values()].slice(0, amount);
				if (!messages || !messages[1]) return message.channel.send(mod.bulkDelete_14d);
				message.channel.bulkDelete(messages).catch((error) => {
					console.log(error.stack);
					message.channel.send('Error: ' + error);
				});
			});
		message.delete();
	}
};
