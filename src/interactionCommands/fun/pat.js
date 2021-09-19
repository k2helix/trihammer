const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'pat',
	description: '🖐️',
	ESdesc: '🖐️',
	usage: 'pat [user]',
	example: 'pat @user\npat',
	type: 7,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user') || interaction.user;

		const { kawaii } = require(`../../utils/lang/${guildConf.lang}.js`);

		let { body } = await request.get('https://nekos.life/api/v2/img/pat');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.pat.replaceAll({ '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		interaction.reply({ embeds: [embed] });
	}
};
