function distort(ctx: NodeCanvasRenderingContext2D, amplitude: number, x: number, y: number, width: number, height: number, strideLevel = 4) {
	const data = ctx.getImageData(x, y, width, height);
	const temp = ctx.getImageData(x, y, width, height);
	const stride = width * strideLevel;
	for (let i = 0; i < width; i++)
		// eslint-disable-line no-plusplus
		for (let j = 0; j < height; j++) {
			// eslint-disable-line no-plusplus
			const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
			const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
			const dest = j * stride + i * strideLevel;
			const src = (j + ys) * stride + (i + xs) * strideLevel;
			data.data[dest] = temp.data[src];
			data.data[dest + 1] = temp.data[src + 1];
			data.data[dest + 2] = temp.data[src + 2];
		}

	ctx.putImageData(data, x, y);

	return ctx;
}
import { NodeCanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'magik',
	description: 'Distort an image',
	cooldown: 5,
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
		distort(ctx, data.width * (1 / 75), 0, 0, data.width, data.height);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(3092790)
					.setImage('attachment://magik.png')
					.setFooter({ text: `${data.width}x${data.height}` })
			],
			files: [{ attachment: canvas.toBuffer(), name: 'magik.png' }]
		});
	}
});
// let msg = await message.channel.send(util.loading);
// let result = await request.post('https://fapi.wrmsr.io/evalmagik', {
// 	headers: {
// 		'Content-Type': 'application/json',
// 		authorization: 'Bearer ' + process.env.FAPI_API_TOKEN
// 	},
// 	body: JSON.stringify({
// 		images: [image],
// 		args: {
// 			text: ['-liquid-rescale', '50%', '-liquid-rescale', '150%']
// 		}
// 	})
// });
