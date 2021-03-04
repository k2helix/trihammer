const { ModelServer } = require('../utils/models');
module.exports = async (client, old_message, new_message) => {
	if (old_message.author.bot) return;
	if (!old_message.content && !new_message.content) return;
	const serverConfig = await ModelServer.findOne({ server: old_message.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let { events } = require(`../utils/lang/${langcode}.js`);
	let logs_channel = old_message.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || logs_channel.type !== 'text') return;
	if (old_message.length > 1800 || new_message.length > 1800) return;
	let obj = {
		'{user}': `${old_message.author.tag} (${old_message.author.id})`,
		'{channel}': `<#${old_message.channel.id}>`,
		'{old}': old_message.content,
		'{new}': new_message.content
	};
	if (old_message.content !== new_message.content) logs_channel.send(events.message.update.replaceAll(obj));
};
