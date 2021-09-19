const { ModelServer } = require('../utils/models');
const { Permissions } = require('discord.js');
module.exports = async (client, role) => {
	const serverConfig = await ModelServer.findOne({ server: role.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = role.guild.channels.cache.get(serverConfig.serverlogs);
	if (!role.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	const entry = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then((audit) => audit.entries.first());

	if (!entry) return;

	let fecha = Date.now() - 10000;
	let user = fecha > entry.createdTimestamp ? 'Bot' : entry.executor;
	if (langcode === 'es') logs_channel.send(`${user} ha borrado un rol: ${role.name}`);
	else if (langcode === 'en') logs_channel.send(`${user} has deleted a role: ${role.name}`);
};
