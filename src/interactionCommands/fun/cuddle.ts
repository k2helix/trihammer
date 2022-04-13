const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = {
	name: 'cuddle',
	description: '<3',
	ESdesc: '<3',
	type: 7,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user') || interaction.user;

		const { kawaii } = require(`../../lib/utils/lang/${guildConf.lang}`);

		let { body } = await request.get('https://nekos.life/api/v2/img/cuddle');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.cuddle.replaceAll({ '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		interaction.reply({ embeds: [embed] });
	}
};