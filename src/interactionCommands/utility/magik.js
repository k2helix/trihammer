function distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
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
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
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
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		let image = interaction.options.getString('image');
		if (!image) {
			let user = interaction.options.getUser('user-avatar') || interaction.user;
			image = user.displayAvatarURL({ format: 'png', size: 1024, dynamic: false });
		}
		if (!image.startsWith('http')) return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });

		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		distort(ctx, 20, 0, 0, data.width, data.height);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'magik.png');
		interaction.reply({ files: [attachment] });
	}
};
// let msg = await message.channel.send(util.loading);
// let result = await request.post('https://fapi.wrmsr.io/evalmagik', {
// 	headers: {
// 		'Content-Type': 'application/json',
// 		authorization: 'Bearer ' + process.env.FAPI_API_TOKEN
// 	},
// 	body: JSON.stringify({
// 		images: [image],
// 		args: {
// 			text: ['-liquid-rescale', '50%', '-liquid-rescale', '150%']
// 		}
// 	})
// });
