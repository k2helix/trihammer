const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { ModelUsers, ModelRank } = require('../../utils/models');

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do ctx.font = `${(fontSize -= 10)}px sans-serif`;
	while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};
module.exports = {
	name: 'rank',
	description: 'Get your rank card',
	ESdesc: 'Obtén tu imagen de rango',
	usage: 'rank [user]',
	example: 'rank @user\nrank',
	cooldown: 3,
	type: 5,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction) {
		interaction.deferReply();
		let user = interaction.options.getUser('user') || interaction.user;
		if (user.bot)
			if (interaction.replied || interaction.deferred) return interaction.editReply({ content: 'Bots do not have rank!', ephemeral: true });
			else return interaction.reply({ content: 'Bots do not have rank!', ephemeral: true });

		let local = await ModelRank.findOne({ id: user.id, server: interaction.guildId }).lean();
		if (!local)
			if (interaction.replied || interaction.deferred) return interaction.editReply({ content: '404 User not found (send some messages and try again)', ephemeral: true });
			else return interaction.reply({ content: '404 User not found (send some messages and try again)', ephemeral: true });
		let gl = await ModelUsers.findOne({ id: user.id }).lean();
		if (!gl)
			if (interaction.replied || interaction.deferred) return interaction.editReply({ content: '404 User not found (send some messages and try again)', ephemeral: true });
			else return interaction.reply({ content: '404 User not found (send some messages and try again)', ephemeral: true });

		let url = gl.rimage;
		if (url === 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true')
			url = 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png';
		let top = await ModelRank.find({ server: interaction.guildId }).lean();
		let posicion = (element) => element.id === user.id && element.server === interaction.guildId;

		const xp = local.xp;
		const nivel = local.nivel;
		const canvas = createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		let porcentaje1 = Math.floor((xp / (nivel / 0.0081654953837673)) * 100);
		let porcentaje = Math.floor((porcentaje1 * 300) / 100);

		const background = await loadImage(url);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.lineJoin = 'bevel';
		ctx.lineWidth = 15;
		ctx.strokeStyle = '#38f';
		ctx.strokeRect(300, 166, 300, 50);
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.fillRect(300, 166, 300, 50);
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(300, 166, porcentaje, 50);
		ctx.closePath();

		ctx.strokeStyle = 'black';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = applyText(canvas, `${user.tag}`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(user.tag, 280, 100);

		ctx.font = '28px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`XP: ${xp}/${Math.floor(nivel / 0.0081654953837673)}`, 310, 200);

		ctx.font = '28px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(
			`Level ${nivel} - Top #${
				top
					.sort((a, b) => {
						return b.nivel - a.nivel || b.xp - a.xp;
					})
					.findIndex(posicion) + 1
			}`,
			295,
			145
		);

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await loadImage(user.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);
		const attachment = new MessageAttachment(canvas.toBuffer(), 'rank-image.png');
		interaction.editReply({ files: [attachment] });
	}
};
