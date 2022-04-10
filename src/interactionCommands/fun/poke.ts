const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'poke',
	description: '👉',
	ESdesc: '👉',
	usage: 'poke [user]',
	example: 'poke\npoke @user',
	type: 7,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user') || interaction.user;

		const { kawaii } = require(`../../lib/utils/lang/${guildConf.lang}`);

		let { body } = await request.get('https://nekos.life/api/v2/img/poke');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.poke.replaceAll({ '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		interaction.reply({ embeds: [embed] });
	}
};
