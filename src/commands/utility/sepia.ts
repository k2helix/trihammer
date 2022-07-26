function sepia(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
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
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'sepia',
	description: 'Sepia an image',
	category: 'image_manipulation',
	client_perms: ['AttachFiles'],
	required_args: [{ index: 0, name: 'image', type: 'string', optional: true }],
	async execute(client, message, args) {
		let image = message.author.displayAvatarURL({ size: 1024, extension: 'png' });
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);

		if (user) image = user.displayAvatarURL({ extension: 'png', size: 1024 });
		if (args[0] && args[0].startsWith('http')) image = args[0];
		if ([...message.attachments.values()][0]) image = [...message.attachments.values()][0].url;

		const { body } = await request.get({ url: image });
		const data = await loadImage(body as Buffer);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		sepia(ctx, 0, 0, data.width, data.height);

		message.channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(3092790)
					.setImage('attachment://sepia.png')
					.setFooter({ text: `${data.width}x${data.height}` })
			],
			files: [{ attachment: canvas.toBuffer(), name: 'sepia.png' }]
		});
	}
});
