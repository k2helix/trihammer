import { AttachmentBuilder } from 'discord.js';
import { CanvasRenderingContext2D, createCanvas, loadImage, registerFont } from 'canvas';
import { ModelUsers, Users } from '../../lib/utils/models';
import MessageCommand from '../../lib/structures/MessageCommand';

registerFont('./assets/fonts/RobotoSlab-VariableFont_wght.ttf', { family: 'RobotoSlab' });

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

export default new MessageCommand({
	name: 'profile',
	description: 'Get your profile card',
	cooldown: 3,
	category: 'social',
	client_perms: ['AttachFiles'],
	required_args: [{ index: 0, name: 'user', type: 'member', optional: true }],
	async execute(_client, message, args) {
		let user = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || message.member!;

		let global = await ModelUsers.findOne({ id: user!.id }).lean();
		if (!global) return message.channel.send('404');

		let top: Users[] = await ModelUsers.find({ globalxp: { $gte: 300000 } }).lean();
		let posicion = (element: Users) => element.id === user!.id;
		let pos =
			top
				.sort((a, b) => {
					return b.globalxp - a.globalxp;
				})
				.findIndex(posicion) + 1;

		const xp = global.globalxp;
		const canvas = createCanvas(442, 330);
		const ctx = canvas.getContext('2d');

		const background = await loadImage(global.pimage);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		const fondo = await loadImage('https://cdn.discordapp.com/attachments/487962590887149603/716060007577419876/capas.png');
		ctx.globalAlpha = 0.75;
		ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = user!.user.tag.length < 12 ? '30px RobotoSlab' : '20px RobotoSlab';
		ctx.fillStyle = '#0e0d0e';
		ctx.fillText(user!.user.tag, 130, 90);

		ctx.font = '17px RobotoSlab';
		ctx.fillStyle = '#0e0d0e';
		ctx.fillText(global.pdesc, 135, 120);

		ctx.font = '24px RobotoSlab';
		ctx.fillStyle = '#0e0d0e';
		ctx.fillText('|\n|\n|\n|\n|', 130, 180);

		ctx.font = '24px RobotoSlab';
		ctx.fillStyle = '#0e0d0e';
		ctx.fillText(`Total XP\n${xp}\nTop ${pos}`, 32, 180);

		ctx.font = '20px RobotoSlab';
		ctx.fillStyle = '#ff0007';
		ctx.fillText(`+${global.rep}rep`, 30, 295);

		ctx.fillStyle = '#0e0d0e';
		ctx.font = '22px RobotoSlab';
		wrapText(ctx, global.ptext, 140, 170, 275, 20);

		const avatar = await loadImage(user!.user.displayAvatarURL({ extension: 'png' }));
		ctx.drawImage(avatar, 27, 52, 100, 100);

		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile-image.png' });
		message.channel.send({ files: [attachment] });
	}
});
