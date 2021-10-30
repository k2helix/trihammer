const { ModelServer } = require('../utils/models');
module.exports = async (client, channel) => {
	const serverConfig = await ModelServer.findOne({ server: channel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = channel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	let mutedR = channel.guild.roles.cache.find((r) => r.name.toLowerCase() == 'trimuted');
	// eslint-disable-next-line curly
	if (mutedR) {
		if (channel.type === 'GUILD_TEXT')
			channel.permissionOverwrites.create(mutedR, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			});
		else if (channel.type === 'GUILD_VOICE')
			channel.permissionOverwrites.create(mutedR, {
				CONNECT: false,
				SPEAK: false
			});
	}

	logs_channel.send(events.channel.create.replaceAll({ '{channel}': channel.type, '{name}': channel.name }));
};
