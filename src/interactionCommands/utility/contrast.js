function contrast(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	const factor = 259 / 100 + 1;
	const intercept = 128 * (1 - factor);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = data.data[i] * factor + intercept;
		data.data[i + 1] = data.data[i + 1] * factor + intercept;
		data.data[i + 2] = data.data[i + 2] * factor + intercept;
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');

module.exports = {
	name: 'contrast',
	description: 'Contrast an image',
	ESdesc: 'Contrasta una imagen',
	usage: 'contrast [user or image or url]',
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	example: 'contrast @user\ncontrast https://cdn.discordapp.com/avatars/461279654158925825/eecd8958a698ef79021d27b5d5362bdc.png?size=1024',
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		let image = interaction.options.getString('image');
		if (!image) {
			let user = interaction.options.getUser('user-avatar') || interaction.user;
			image = user.displayAvatarURL({ format: 'jpeg', size: 1024, dynamic: false });
		}
		if (!image.startsWith('http')) return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });

		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		contrast(ctx, 0, 0, data.width, data.height);

		//MessageAttachement - Discord.js-12.0.0
		const attachment = new MessageAttachment(canvas.toBuffer(), 'contrast.png');
		interaction.reply({ files: [attachment] });
	}
};
