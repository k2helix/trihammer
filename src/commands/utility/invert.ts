function invert(ctx: NodeCanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 255 - data.data[i];
		data.data[i + 1] = 255 - data.data[i + 1];
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'invert',
	description: 'Invert an image',
	category: 'image_manipulation',
	client_perms: ['ATTACH_FILES'],
	required_args: [{ index: 0, name: 'image', type: 'string', optional: true }],
	async execute(client, message, args) {
		let image = message.author.displayAvatarURL({ size: 1024, format: 'png' });
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);

		if (user) image = user.displayAvatarURL({ format: 'png', size: 1024 });
		if (args[0] && args[0].startsWith('http')) image = args[0];
		if ([...message.attachments.values()][0]) image = [...message.attachments.values()][0].url;

		const { body } = await request.get(image);
		const data = await loadImage(body as Buffer);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		invert(ctx, 0, 0, data.width, data.height);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(3092790)
					.setImage('attachment://invert.png')
					.setFooter({ text: `${data.width}x${data.height}` })
			],
			files: [{ attachment: canvas.toBuffer(), name: 'invert.png' }]
		});
	}
});
