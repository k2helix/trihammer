const { ModelServer } = require('../utils/models');
module.exports = async (client, channel) => {
	const serverConfig = await ModelServer.findOne({ server: channel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = channel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	const entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then((audit) => audit.entries.first());

	if (!entry) return;

	let fecha = Date.now() - 10000;
	let user = fecha > entry.createdTimestamp ? 'Bot' : entry.executor.tag;

	logs_channel.send(events.channel.delete.replaceAll({ '{user}': user, '{channel}': channel.type, '{name}': channel.name }));
};
