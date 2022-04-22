function greyscale(ctx: NodeCanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness;
		data.data[i + 1] = brightness;
		data.data[i + 2] = brightness;
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
	name: 'grayscale',
	description: 'Make an image gray',
	category: 'image_manipulation',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let image = (interaction as CommandInteraction).options.getString('image');
		if (!image)
			image = ((interaction as CommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ format: 'png', size: 1024, dynamic: false })!;

		if (!image.startsWith('http')) return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });

		const { body } = await request.get(image);
		const data = await loadImage(body as Buffer);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		greyscale(ctx, 0, 0, data.width, data.height);

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(3092790)
					.setImage('attachment://greyscale.png')
					.setFooter({ text: `${data.width}x${data.height}` })
			],
			files: [{ attachment: canvas.toBuffer(), name: 'greyscale.png' }]
		});
	}
});
