const Discord = require('discord.js');
const { loadImage, createCanvas } = require('canvas');
const { ModelUsers } = require('../../lib/utils/models');

function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for (var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else line = testLine;
	}
	context.fillText(line, x, y);
}

module.exports = {
	name: 'profile',
	description: 'Get your profile card',
	ESdesc: 'Obtén tu imagen de perfil',
	usage: 'profile [user]',
	example: 'profile\nprofile @user',
	cooldown: 3,
	type: 5,
	myPerms: [true, 'ATTACH_FILES'],
	execute(client, interaction) {
		interaction.deferReply().then(async () => {
			let user = interaction.options.getUser('user') || interaction.user;
			if (user.bot) return interaction.editReply({ content: 'Bots do not have profile!', ephemeral: false });

			let global = await ModelUsers.findOne({ id: user.id }).lean();
			if (!global) return interaction.editReply({ content: '404 User not found (send some messages and try again)', ephemeral: false });

			const xp = global.globalxp;
			const canvas = createCanvas(442, 330);
			var context = canvas.getContext('2d');
			const ctx = canvas.getContext('2d');

			const background = await loadImage(global.pimage);
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			const fondo = await loadImage('https://cdn.discordapp.com/attachments/487962590887149603/716060007577419876/capas.png');
			ctx.globalAlpha = 0.75;
			ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = '#74037b';
			ctx.strokeRect(0, 0, canvas.width, canvas.height);

			ctx.font = user.tag.length < 12 ? '30px sans-serif' : '20px sans-serif';
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(user.tag, 130, 90);

			ctx.font = '17px sans-serif';
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(global.pdesc, 135, 120);

			ctx.font = '24px sans-serif';
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText('|\n|\n|\n|\n|', 130, 180);

			ctx.font = '24px sans-serif';
			ctx.fillStyle = '#0e0d0e';
			ctx.fillText(`Total XP\n${xp}`, 32, 180);

			ctx.font = '20px sans-serif';
			ctx.fillStyle = '#ff0007';
			ctx.fillText(`+${global.rep}rep`, 30, 295);

			context.fillStyle = '#0e0d0e';
			context.font = '22px sans-serif';
			wrapText(canvas.getContext('2d'), global.ptext, 140, 170, 275, 20);

			const avatar = await loadImage(user.displayAvatarURL({ format: 'png' }));
			ctx.drawImage(avatar, 27, 52, 100, 100);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile-image.png');
			interaction.editReply({ files: [attachment] });
		});
	}
};
