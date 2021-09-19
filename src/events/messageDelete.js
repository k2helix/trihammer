/* eslint-disable no-unreachable */
const { ModelServer } = require('../utils/models');
const { Permissions } = require('discord.js');
module.exports = async (client, message) => {
	if (message.author.bot || message.system) return;
	if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
	const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let { events } = require(`../utils/lang/${langcode}.js`);
	const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then((audit) => audit.entries.first());

	if (!entry) return;
	let fecha = Date.now() - 10000;

	let user = fecha > entry.createdTimestamp ? message.author : entry.executor;
	let logs_channel = message.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	let attachments = [...message.attachments.values()];
	if (!message.content && !attachments[0]) return;
	let content = `\`\`\`${message.content}\`\`\``;
	if (attachments[0]) content = `\`\`\`${message.content}\`\`\`\n${attachments[0].url.replace('cdn.discordapp.com', 'media.discordapp.net')}`;

	let obj = {
		'{user}': user.tag,
		'{author}': message.author.tag,
		'{channel}': `<#${message.channel.id}>`,
		'{content}': content
	};
	logs_channel.send(events.message.delete.replaceAll(obj));
};
