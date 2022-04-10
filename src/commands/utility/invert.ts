function invert(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 255 - data.data[i];
		data.data[i + 1] = 255 - data.data[i + 1];
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'invert',
	description: 'Invert an image',
	ESdesc: 'Invierte los colores de una imagen',
	usage: 'invert [user or image or url]',
	example: 'invert @user\ninvert',
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
		invert(ctx, 0, 0, data.width, data.height);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'invert.png');
		message.channel.send({ files: [attachment] });
	}
};
