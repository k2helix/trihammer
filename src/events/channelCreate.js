const { ModelServer } = require('../utils/models');
module.exports = async (client, channel) => {
	if (channel.type === 'dm') return;
	const serverConfig = await ModelServer.findOne({ server: channel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = channel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'text') return;

	const entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then((audit) => audit.entries.first());

	if (!entry) return;

	let fecha = Date.now() - 10000;
	let user = fecha > entry.createdTimestamp ? 'Bot' : entry.executor.tag;

	let mutedR = channel.guild.roles.cache.find((r) => r.name.toLowerCase() == 'trimuted');
	// eslint-disable-next-line curly
	if (mutedR) {
		if (channel.type === 'text')
			channel.createOverwrite(mutedR, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			});
		else if (channel.type === 'voice')
			channel.createOverwrite(mutedR, {
				CONNECT: false,
				SPEAK: false
			});
	}

	logs_channel.send(events.channel.create.replaceAll({ '{user}': user, '{channel}': channel.type, '{name}': channel.name }));
};
