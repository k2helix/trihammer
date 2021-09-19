/* eslint-disable no-unreachable */
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'gmagik',
	description: 'Distort a gif',
	ESdesc: 'Distorsiona un gif',
	usage: 'gmagik [user or gif or url]',
	example: 'gmagik @user\ngmagik',
	type: 4,
	cooldown: 5,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		return message.channel.send('Command disabled');
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let image = user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
		let attachments = [...message.attachments.values()];
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];

		let msg = await message.channel.send(util.loading);
		let result = await request.post('https://fapi.wrmsr.io/magikscript', {
			headers: {
				'Content-Type': 'application/json',
				authorization: 'Bearer ' + process.env.FAPI_API_TOKEN
			},
			body: JSON.stringify({
				images: [image],
				args: {
					text: 'magik',
					gif: image.toLowerCase().includes('.gif') ? true : false
				}
			})
		});

		const attachment = new MessageAttachment(result.raw, 'magik.gif');
		message.channel.send({ files: [attachment] });
		msg.delete();
	}
};
