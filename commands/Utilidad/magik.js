const dcanvas = require('discord.js-canvas')
const { createCanvas, loadImage } = require("canvas");
const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'magik',
	description: 'Distort an image',
	async execute(client, message, args) {
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
		let image = user.user.displayAvatarURL({format: 'png'})
    let attachments = message.attachments.array()
    if(attachments[0]) image = attachments[0].url
    const { body } = await request.get(image);
     const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		dcanvas.distort(ctx, Math.floor(Number(data.width) / 33),0, 0, data.width, data.height, 4);


//MessageAttachement - Discord.js-12.0.0
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'magik.png');
    message.channel.send(attachment)
	}
};