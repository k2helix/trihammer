const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'slap',
	description: '👋',
	ESdesc: '👋',
	usage: 'slap [user]',
	example: 'slap\nslap @user',
	type: 7,
	async execute(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		const { kawaii } = require(`../../lib/utils/lang/${langcode}`);

		let { body } = await request.get('https://nekos.life/api/v2/img/slap');
		let embed = new MessageEmbed();
		embed.setTitle(kawaii.slap.replaceAll({ '{author}': message.member.displayName, '{member}': user.displayName }));
		embed.setColor('RANDOM');
		embed.setImage(body.url);

		message.channel.send({ embeds: [embed] });
	}
};
