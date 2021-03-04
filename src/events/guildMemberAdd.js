/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

const Canvas = require('canvas');

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
const { ModelServer, ModelMutes, ModelWelc } = require('../utils/models');
module.exports = async (client, member) => {
	const serverConfig = await ModelServer.findOne({ server: member.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let mutes = await ModelMutes.findOne({ active: true, server: member.guild.id, id: member.id });
	if (mutes) {
		let Muted = member.guild.roles.cache.find((mute) => mute.name.toLowerCase() === 'trimuted');
		if (Muted) member.roles.add(Muted);
	}
	if (serverConfig.autorole !== 'none') {
		let role = member.guild.roles.cache.get(serverConfig.autorole);
		if (role) member.roles.add(role);
	}
	const welcomeConfig = await ModelWelc.findOne({ server: member.guild.id });
	if (!welcomeConfig) {
		let logs_channel = member.guild.channels.cache.get(serverConfig.memberlogs);
		if (!logs_channel || logs_channel.type !== 'text') return;
		if (langcode === 'en')
			logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} has joined the server, created ${member.user.createdAt}`);
		else if (langcode === 'es')
			logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} ha entrado al servidor, creado en ${member.user.createdAt}`);
	} else {
		let canal = welcomeConfig.canal;
		let welcomechannel = member.guild.channels.cache.get(canal);
		let logs_channel = member.guild.channels.cache.get(serverConfig.memberlogs);
		let text = welcomeConfig.text;
		const canvas = Canvas.createCanvas(1638, 888);
		const context = canvas.getContext('2d');
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage(welcomeConfig.image);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		ctx.font = '80px sans-serif';
		ctx.fillStyle = '#e91e63';
		ctx.fillText(member.user.username + ',', canvas.width / 10, canvas.height / 1.8);
		context.font = '60px sans-serif';
		context.fillStyle = welcomeConfig.color;
		wrapText(canvas.getContext('2d'), text, 140, 610, 1400, 65);
		ctx.beginPath();
		ctx.arc(800, 200, 175, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 625, 25, 350, 350);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
		if (logs_channel && welcomechannel) {
			welcomechannel.send(attachment);
			if (langcode === 'en')
				logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} has joined the server, created ${member.user.createdAt}`);
			else if (langcode === 'es')
				logs_channel.send(
					`<:online:663872345009684481> ${member.user.tag} - ${member.id} ha entrado al servidor, creado hace ${member.user.createdAt}`
				);
		} else if (welcomechannel && !logs_channel) welcomechannel.send(attachment);
	}
};
