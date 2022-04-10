function invert(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 255 - data.data[i];
		data.data[i + 1] = 255 - data.data[i + 1];
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'invert',
	description: 'Invert an image',
	ESdesc: 'Invierte los colores de una imagen',
	usage: 'invert [user or image or url]',
	example: 'invert @user\ninvert',
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../lib/utils/lang/${guildConf.lang}`);
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
		invert(ctx, 0, 0, data.width, data.height);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'invert.png');
		interaction.reply({ files: [attachment] });
	}
};
