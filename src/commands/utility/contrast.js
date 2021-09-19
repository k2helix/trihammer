function contrast(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	const factor = 259 / 100 + 1;
	const intercept = 128 * (1 - factor);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = data.data[i] * factor + intercept;
		data.data[i + 1] = data.data[i + 1] * factor + intercept;
		data.data[i + 2] = data.data[i + 2] * factor + intercept;
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');

module.exports = {
	name: 'contrast',
	description: 'Contrast an image',
	ESdesc: 'Contrasta una imagen',
	usage: 'contrast [user or image or url]',
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	example: 'contrast @user\ncontrast https://cdn.discordapp.com/avatars/461279654158925825/eecd8958a698ef79021d27b5d5362bdc.png?size=1024',
	async execute(client, message, args) {
		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
		let image = user.displayAvatarURL({ format: 'png' }).replace('gif', 'png');
		let attachments = [...message.attachments.values()];
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.author.id && args[0] && args[0].startsWith('http')) image = args[0];
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		contrast(ctx, 0, 0, data.width, data.height);

		//MessageAttachement - Discord.js-12.0.0
		const attachment = new MessageAttachment(canvas.toBuffer(), 'contrast.png');
		message.channel.send({ files: [attachment] });
	}
};
