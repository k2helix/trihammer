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
	async execute(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		if (user.bot) return;

		let local = await ModelRank.findOne({ id: user.id, server: message.guild.id }).lean();
		if (!local) {
			let newRankModel = new ModelRank({
				id: message.author.id,
				server: message.guild.id,
				nivel: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		let gl = await ModelUsers.findOne({ id: user.id }).lean();
		let url = gl.rimage;
		let top = await ModelRank.find({ server: message.guild.id }).lean();
		let posicion = (element) => element.id === user.id && element.server === message.guild.id;

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

		ctx.font = applyText(canvas, `${user.user.tag}`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(user.user.tag, 280, 100);

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

		const avatar = await loadImage(user.user.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);
		const attachment = new MessageAttachment(canvas.toBuffer(), 'rank-image.png');
		message.channel.send(attachment);
	}
};
