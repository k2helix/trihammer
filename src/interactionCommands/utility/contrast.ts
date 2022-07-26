function contrast(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
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
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'contrast',
	description: 'Contrast an image',
	category: 'image_manipulation',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let image =
			(interaction as ChatInputCommandInteraction).options.getString('image') ||
			(interaction as ChatInputCommandInteraction).options.getAttachment('attachment')?.url ||
			((interaction as ChatInputCommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })!;

		if (!image.startsWith('http')) return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });

		const { body } = await request.get({ url: image });
		const data = await loadImage(body as Buffer);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		contrast(ctx, 0, 0, data.width, data.height);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(3092790)
					.setImage('attachment://contrast.png')
					.setFooter({ text: `${data.width}x${data.height}` })
			],
			files: [{ attachment: canvas.toBuffer(), name: 'contrast.png' }]
		});
	}
});
