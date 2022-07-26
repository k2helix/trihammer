import request from 'node-superfetch';
import { load } from 'cheerio';
import MessageCommand from '../../lib/structures/MessageCommand';
import { createCanvas, loadImage } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'test',
	description: 'test',
	aliases: ['test'],
	category: 'unknown',
	async execute(client, message, args) {
		if (!client.config.administrators.includes(message.author.id)) return;
		if (!args[0]) return;
		let tenorGif = args[0];
		let { text } = await request.get({ url: tenorGif });
		let $ = load(text!);
		let imgUrl = $('meta[name="twitter:image"]')[0].attribs.content;
		console.log(imgUrl);

		const canvas = createCanvas(395, 300);
		const ctx = canvas.getContext('2d');

		let randomNumber = Math.floor(Math.random() * 10);
		let defaultBackground = 'https://cdn.discordapp.com/attachments/328036723273498624/974036450460966912/penege.png?size=4096';
		if (randomNumber === 0) defaultBackground = 'https://cdn.discordapp.com/attachments/328036723273498624/974036838014668900/peenege.png?size=4096';

		const background = await loadImage(defaultBackground);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		const tenorImg = await loadImage(imgUrl);
		ctx.drawImage(tenorImg, 0, 0, 100, 100);

		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'test.png' });
		message.channel.send({ files: [attachment] });
	}
});
