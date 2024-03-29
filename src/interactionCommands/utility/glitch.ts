import { createCanvas, loadImage } from 'canvas';
import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glitch = require('glitch-canvas');

export default new Command({
	name: 'glitch',
	description: 'Glitch an image',
	cooldown: 10,
	client_perms: ['AttachFiles'],
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let image =
			(interaction as ChatInputCommandInteraction).options.getString('image') ||
			(interaction as ChatInputCommandInteraction).options.getAttachment('attachment')?.url ||
			((interaction as ChatInputCommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })!;

		if (!image.startsWith('http')) return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });

		const { body } = await request.get(image);
		const data = await loadImage(body as Buffer);

		const canvas = createCanvas(data.width < 250 ? 278 : data.width, data.height < 250 ? 278 : data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
		const buffer = canvas.toBuffer();

		let seed = Math.floor(Math.random() * 20) + 1;
		let iterations = Math.floor(Math.random() * 20) + 1;
		let amount = Math.floor(Math.random() * 20) + 1;
		let quality = Math.floor(10 + Math.random() * 89) + 1;
		let text = `Seed: ${seed} | Iterations: ${iterations} | Amount ${amount} | Quality ${quality}`;
		glitch({ seed: seed, iterations: iterations, amount: amount, quality: quality })
			.fromBuffer(buffer)
			.toBuffer()
			.then(function (glitchedBuffer: Buffer) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(3092790)
							.setDescription(text)
							.setImage('attachment://glitch.jpeg')
							.setFooter({ text: `${data.width}x${data.height}` })
					],
					files: [
						{
							attachment: glitchedBuffer,
							name: 'glitch.jpeg'
						}
					]
				});
			})
			.catch((error: Error) => {
				interaction.reply(`Please, use the command another time (${text}). ` + error);
			});
	}
});
