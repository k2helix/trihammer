const { ModelServer } = require('../utils/models');
module.exports = async (client, role) => {
	const serverConfig = await ModelServer.findOne({ server: role.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = role.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	if (langcode === 'es') logs_channel.send(`Un rol fue borrado: ${role.name}`);
	else if (langcode === 'en') logs_channel.send(`A role was deleted: ${role.name}`);
};
