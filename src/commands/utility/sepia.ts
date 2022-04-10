function sepia(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness + 100;
		data.data[i + 1] = brightness + 50;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'sepia',
	description: 'Sepia an image',
	ESdesc: 'Pasa a color sepia una imagen',
	usage: 'sepia [user or image or url]',
	example: 'sepia @user',
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
		let image = user.displayAvatarURL({ format: 'png' }).replace('gif', 'png');
		let attachments = [...message.attachments.values()];
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		sepia(ctx, 0, 0, data.width, data.height);

		//MessageAttachement - Discord.js-12.0.0
		const attachment = new MessageAttachment(canvas.toBuffer(), 'sepia.png');
		message.channel.send({ files: [attachment] });
	}
};
