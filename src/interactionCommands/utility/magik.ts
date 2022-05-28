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
import { CommandInteraction, MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'magik',
	description: 'Distort an image',
	category: 'image_manipulation',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let image =
			(interaction as CommandInteraction).options.getString('image') ||
			(interaction as CommandInteraction).options.getAttachment('attachment')?.url ||
			((interaction as CommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ format: 'png', size: 1024, dynamic: false })!;

		if (!image.startsWith('http')) return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });

		const { body } = await request.get(image);
		const data = await loadImage(body as Buffer);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		distort(ctx, data.width * (1 / 75), 0, 0, data.width, data.height);

		interaction.reply({
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
