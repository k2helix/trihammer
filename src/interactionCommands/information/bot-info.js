const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'bot-info',
	description: 'Bot info',
	ESdesc: 'Bot info',
	type: -1,
	execute(client, interaction) {
		let embed = new MessageEmbed()
			.setTitle('Bot Info')
			.setDescription(
				`👥 ${client.users.cache.size} cached users\n🏘️ ${client.guilds.cache.size} cached servers\n☄️ ${client.channels.cache.size} cached channels\n🔧 ${client.commands.size} commands\n`
			)
			.setColor('RANDOM');
		interaction.reply({ embeds: [embed] });
	}
};
