const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'botinfo',
	description: 'Bot info',
	ESdesc: 'Bot info',
	type: -1,
	execute(client, message) {
		let embed = new MessageEmbed()
			.setTitle('Bot Info')
			.setDescription(
				`👥 ${client.users.cache.size} cached users\n🏘️ ${client.guilds.cache.size} cached servers\n☄️ ${client.channels.cache.size} cached channels\n🔧 ${client.commands.size} commands\n`
			)
			.setColor('RANDOM');
		message.channel.send({ embeds: [embed] });
	}
};
