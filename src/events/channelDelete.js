const { ModelServer } = require('../utils/models');
module.exports = async (client, channel) => {
	const serverConfig = await ModelServer.findOne({ server: channel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = channel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	logs_channel.send(events.channel.delete.replaceAll({ '{channel}': channel.type, '{name}': channel.name }));
};
