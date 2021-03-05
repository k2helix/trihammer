const { ModelServer } = require('../utils/models');
module.exports = (client, oldUser, newUser) => {
	if (oldUser.tag !== newUser.tag)
		client.guilds.cache.forEach(async (g) => {
			const serverConfig = await ModelServer.findOne({ server: g.id }).lean();
			if (!serverConfig) return;
			let langcode = serverConfig.lang;
			let logs_channel = g.channels.cache.get(serverConfig.memberlogs);
			if (!logs_channel || logs_channel.type !== 'text') return;

			if (!g.members.cache.has(oldUser.id)) return;
			if (!logs_channel || logs_channel.type !== 'text') return;
			if (langcode === 'es')
				logs_channel.send(`El usuario ${oldUser.tag} ha cambiado de nombre de usuario, antes era \`${oldUser.tag}\` y ahora es \`${newUser.tag}\`.`);
			else if (langcode === 'en')
				logs_channel.send(
					`User ${oldUser.tag} has changed their username, before change was \`${oldUser.tag}\` and after change \`${newUser.tag}\`.`
				);
		});
};
