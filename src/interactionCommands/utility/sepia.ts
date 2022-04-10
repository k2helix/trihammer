function sepia(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness + 100;
		data.data[i + 1] = brightness + 50;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);

	return ctx;
}
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const request = require('node-superfetch');
module.exports = {
	name: 'sepia',
	description: 'Sepia an image',
	ESdesc: 'Pasa a color sepia una imagen',
	usage: 'sepia [user or image or url]',
	example: 'sepia @user',
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
		sepia(ctx, 0, 0, data.width, data.height);

		//MessageAttachement - Discord.js-12.0.0
		const attachment = new MessageAttachment(canvas.toBuffer(), 'sepia.png');
		interaction.reply({ files: [attachment] });
	}
};
