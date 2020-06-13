const dcanvas = require('discord.js-canvas')
const { createCanvas, loadImage } = require("canvas");
const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'sepia',
	description: 'sepia an image',
	async execute(client, message, args) {
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
		let image = user.user.displayAvatarURL({format: 'png'}).replace('gif', 'png')
    let attachments = message.attachments.array()
    if(attachments[0]) image = attachments[0].url
    const { body } = await request.get(image);
     const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		dcanvas.sepia(ctx,0, 0, data.width, data.height);


//MessageAttachement - Discord.js-12.0.0
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sepia.png');
    message.channel.send(attachment)
	}
};