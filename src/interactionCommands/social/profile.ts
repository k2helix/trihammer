import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { ModelUsers } from '../../lib/utils/models';
import Command from '../../lib/structures/Command';
// registerFont('./assets/fonts/RobotoSlab-VariableFont_wght.ttf', { family: 'RobotoSlab' });

const font = 'MANROPE_BOLD,NOTO_COLOR_EMOJI';

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
	let words = text.split(' ');
	let line = '';

	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + ' ';
		let metrics = context.measureText(testLine);
		let testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else line = testLine;
	}
	context.fillText(line, x, y);
}

export default new Command({
	name: 'profile',
	description: 'Get your profile card',
	cooldown: 3,
	category: 'social',
	client_perms: ['AttachFiles'],
	execute(client, interaction) {
		interaction.deferReply().then(async () => {
			let user = (interaction as ChatInputCommandInteraction).options.getUser('user') || interaction.user;
			if (user.bot) return interaction.editReply({ embeds: [client.redEmbed('Bots do not have profile!')] });

			let global = await ModelUsers.findOne({ id: user.id }).lean();
			if (!global) return interaction.editReply({ embeds: [client.redEmbed('404 User not found in database (send some messages and try again)')] });

			const xp = global.globalxp;
			const canvas = createCanvas(442, 330);
			const ctx = canvas.getContext('2d');

			const background = await loadImage(global.pimage);
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

			const layers = await loadImage('assets/profile/profile-layers.png');
			ctx.globalAlpha = 0.75;
			ctx.drawImage(layers, 0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = '#74037b';
			ctx.strokeRect(0, 0, canvas.width, canvas.height);

			ctx.font = user.tag.length < 12 ? `30px ${font}` : `20px ${font}`;
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(user.tag, 130, 90);

			ctx.font = `17px ${font}`;
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(global.pdesc, 135, 120);

			// ctx.font = '24px ${font}';
			// ctx.fillStyle = '#0e0d0e';
			// ctx.fillText('|\n|\n|\n|\n|', 130, 180);

			ctx.font = `bold 22px ${font}`;
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(`Total XP`, 32, 180);

			ctx.font = `22px ${font}`;
			ctx.fillText(`${xp}`, 32, 210);

			ctx.font = `bold 20px ${font}`;
			ctx.fillStyle = '#00c080';
			ctx.fillText(`+${global.rep} rep`, 38, 265);

			ctx.fillStyle = `#0e0d0e`;
			ctx.font = `22px ${font}`;
			wrapText(ctx, global.ptext, 140, 170, 275, 20);

			const avatar = await loadImage(user.displayAvatarURL({ extension: 'png' }));
			ctx.drawImage(avatar, 27, 51, 101, 102);

			const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile-image.png' });
			interaction.editReply({ files: [attachment] });
		});
	}
});
