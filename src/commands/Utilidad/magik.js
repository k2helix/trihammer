// function distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
//   const data = ctx.getImageData(x, y, width, height);
//   const temp = ctx.getImageData(x, y, width, height);
//   const stride = width * strideLevel;
//   for (let i = 0; i < width; i++) { // eslint-disable-line no-plusplus
//     for (let j = 0; j < height; j++) { // eslint-disable-line no-plusplus
//       const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
//       const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
//       const dest = (j * stride) + (i * strideLevel);
//       const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
//       data.data[dest] = temp.data[src];
//       data.data[dest + 1] = temp.data[src + 1];
//       data.data[dest + 2] = temp.data[src + 2];
//     }
//   }
//   ctx.putImageData(data, x, y);

//   return ctx;
// }
const { MessageAttachment } = require('discord.js');
const { ModelServer } = require('../../utils/models');
const request = require('node-superfetch');
module.exports = {
	name: 'magik',
	description: 'Distort an image',
	ESdesc: 'Distorsiona una imagen',
	usage: 'magik [user or image or url]',
	example: 'magik @user\ndistort',
	cooldown: 5,
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let image = user.user.displayAvatarURL({ format: 'png', size: 1024 });
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let attachments = message.attachments.array();
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];
		if (image.toLowerCase().includes('.gif')) return message.channel.send('gifs === gmagik');
		let msg = await message.channel.send(util.loading);
		let result = await request.post('https://fapi.wrmsr.io/evalmagik', {
			headers: {
				'Content-Type': 'application/json',
				authorization: 'Bearer ' + process.env.FAPI_API_TOKEN
			},
			body: JSON.stringify({
				images: [image],
				args: {
					text: ['-liquid-rescale', '50%', '-liquid-rescale', '150%']
				}
			})
		});

		const attachment = new MessageAttachment(result.raw, 'magik.png');
		message.channel.send(attachment);
		msg.delete();
	}
};
