import { AttachmentBuilder, GuildMember } from 'discord.js';
import Canvas from 'canvas';
import { ModelMutes, ModelServer, ModelWelc, Server, Welc } from '../lib/utils/models';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
function wrapText(context: Canvas.CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
	const words = text.split(' ');
	let line = '';

	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + ' ';
		const metrics = context.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else line = testLine;
	}
	context.fillText(line, x, y);
}
export default async (client: ExtendedClient, member: GuildMember) => {
	const serverConfig: Server = await ModelServer.findOne({ server: member.guild.id }).lean();
	if (!serverConfig) return;

	const mutes = await ModelMutes.findOne({ active: true, server: member.guild.id, id: member.id });
	if (mutes) {
		const Muted = member.guild.roles.cache.find((mute) => mute.name.toLowerCase() === 'trimuted');
		if (Muted) member.roles.add(Muted);
	}
	if (serverConfig.autorole !== 'none') {
		const role = member.guild.roles.cache.get(serverConfig.autorole);
		if (role) member.roles.add(role);
	}
	const welcomeConfig: Welc = await ModelWelc.findOne({ server: member.guild.id });
	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	const logs_channel = member.guild.channels.cache.get(serverConfig.memberlogs);
	if (logs_channel && logs_channel.isTextBased()) logs_channel.send({ embeds: [client.blueEmbed(events.member.add(member.user))] });

	if (welcomeConfig) {
		const canal = welcomeConfig.canal;
		const welcomechannel = member.guild.channels.cache.get(canal);
		const text = welcomeConfig.text;

		const canvas = Canvas.createCanvas(1638, 888);
		const context = canvas.getContext('2d');
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage(welcomeConfig.image);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		ctx.font = '80px sans-serif';
		ctx.fillStyle = '#e91e63';
		ctx.fillText(member.user.username + ',', canvas.width / 10, canvas.height / 1.8);
		context.font = '60px sans-serif';
		context.fillStyle = welcomeConfig.color;
		wrapText(canvas.getContext('2d'), text, 140, 610, 1400, 65);
		ctx.beginPath();
		ctx.arc(800, 200, 175, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
		ctx.drawImage(avatar, 625, 25, 350, 350);
		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });
		if (welcomechannel && welcomechannel.isTextBased()) welcomechannel.send({ files: [attachment] });
	}
};
