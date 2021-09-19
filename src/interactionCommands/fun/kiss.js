const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'kiss',
	description: ':3',
	ESdesc: ':3',
	type: 7,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user') || interaction.user;

		const { kawaii } = require(`../../utils/lang/${guildConf.lang}.js`);

		let { body } = await request.get('https://nekos.life/api/v2/img/kiss');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.kiss.replaceAll({ '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		interaction.reply({ embeds: [embed] });
	}
};
