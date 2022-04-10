const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'hug',
	description: '🤗',
	ESdesc: '🤗',
	usage: 'hug [user]',
	example: 'hug\nhug @user',
	type: 7,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user') || interaction.user;

		const { kawaii } = require(`../../lib/utils/lang/${guildConf.lang}`);

		let { body } = await request.get('https://nekos.life/api/v2/img/hug');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.hug.replaceAll({ '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		interaction.reply({ embeds: [embed] });
	}
};
