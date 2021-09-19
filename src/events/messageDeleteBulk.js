const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../utils/models');
module.exports = async (client, messages) => {
	let msg = messages.first();
	const serverConfig = await ModelServer.findOne({ server: msg.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let { events } = require(`../utils/lang/${langcode}.js`);
	let logs_channel = msg.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	if (!msg.content) return;
	const array = [];
	messages.forEach((message) => {
		if (!message.content) return;
		if (message.author.bot || message.system) return;
		array.push(`${message.author.tag} (${message.author.id}): ${message.content}`);
	});
	let obj = {
		'{amount}': array.join('\n').slice(0, 2000).length,
		'{total}': array.join('\n').length
	};
	const embed = new MessageEmbed()
		.setTitle(events.message.deleteBulk.deleted.replace('{messages}', messages.size))
		.setDescription(`\`\`\`css\n${array.join('\n').slice(0, 2000)}\`\`\``)
		.setFooter(events.message.deleteBulk.showing.replaceAll(obj));
	logs_channel.send({ embeds: [embed] });
};
