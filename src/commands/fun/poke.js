const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'poke',
	description: '👉',
	ESdesc: '👉',
	usage: 'poke [user]',
	example: 'poke\npoke @user',
	type: 7,
	async execute(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		const { kawaii } = require(`../../utils/lang/${langcode}.js`);

		let { body } = await request.get('https://nekos.life/api/v2/img/poke');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.poke.replaceAll({ '{author}': message.member.displayName, '{member}': user.displayName }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		message.channel.send({ embeds: [embed] });
	}
};
