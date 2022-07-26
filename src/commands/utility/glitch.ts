// const request = require('node-superfetch');
// const { AttachmentBuilder } = require('discord.js');
// module.exports = {
// 	name: 'glitch',
// 	description: 'Glitch an image',
// 	ESdesc: 'Glitchea una imagen',
// 	usage: 'glitch [user or image or url]',
// 	example: 'glitch\nglitch @user',
// 	cooldown: 3,
// 	type: 4,
// 	myPerms: [true, 'AttachFiles'],
// 	async execute(client, message, args) {
// 		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
// 		let image = user.displayAvatarURL({ extension: 'png', size: 1024 });
// 		let attachments = [...message.attachments.values()];
// 		if (attachments[0]) image = attachments[0].url;
// 		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];

// 		let result = await request.post('https://fapi.wrmsr.io/glitch', {
// 			headers: {
// 				'Content-Type': 'application/json',
// 				authorization: 'Bearer ' + process.env.FAPI_API_TOKEN
// 			},
// 			body: JSON.stringify({
// 				images: [image],
// 				args: {
// 					iterations: Math.floor(Math.random() * 99) + 1,
// 					amount: Math.floor(Math.random() * 30) + 1
// 				}
// 			})
// 		});
// 		const attachment = new AttachmentBuilder(result.raw, 'glitch.png');
// 		message.channel.send(`Glitched image`, attachment);
// 	}
// };

import { createCanvas, loadImage } from 'canvas';
import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glitch = require('glitch-canvas');

export default new MessageCommand({
	name: 'glitch',
	description: 'Glitch an image',
	cooldown: 10,
	required_args: [{ index: 0, name: 'image', type: 'string', optional: true }],
	client_perms: ['AttachFiles'],
	async execute(client, message, args) {
		let image = message.author.displayAvatarURL({ size: 1024, extension: 'png' });
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);

		if (user) image = user.displayAvatarURL({ extension: 'png', size: 1024 });
		if (args[0] && args[0].startsWith('http')) image = args[0];
		if ([...message.attachments.values()][0]) image = [...message.attachments.values()][0].url;

		const { body } = await request.get({ url: image });
		const data = await loadImage(body as Buffer);

		const canvas = createCanvas(data.width < 250 ? 278 : data.width, data.height < 250 ? 278 : data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
		const buffer = canvas.toBuffer();

		let seed = Math.floor(Math.random() * 20);
		let iterations = Math.floor(Math.random() * 20);
		let amount = Math.floor(Math.random() * 20);
		let quality = Math.floor(10 + Math.random() * 89);
		let text = `Seed: ${seed} | Iterations: ${iterations} | Amount ${amount} | Quality ${quality}`;
		glitch({ seed: seed, iterations: iterations, amount: amount, quality: quality })
			.fromBuffer(buffer)
			.toBuffer()
			.then(function (glitchedBuffer: Buffer) {
				message.channel.send({
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
				message.channel.send(`Please, use the command another time (${text}). ` + error);
			});
	}
});
