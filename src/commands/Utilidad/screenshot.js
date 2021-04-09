// const captureWebsite = require('capture-website');
// const { MessageEmbed } = require('discord.js');
// const { ModelServer } = require('../../utils/models');
const { get } = require('node-superfetch');
module.exports = {
	name: 'screenshot',
	description: 'Take an screenshot of a website',
	ESdesc: 'Toma una captura de pantalla de un sitio web',
	usage: 'screenshot <url> [delay (ms)] [width x height]',
	example: 'screenshot https://twitter.com 2000\nscreenshot discord.com 1200x800',
	cooldown: 10,
	aliases: ['ss'],
	type: 1,
	async execute(client, message, args) {
		if (!args[0]) return;
		let website = args[0].includes('http') ? args[0] : `https://${args[0]}`;
		let delay = isNaN(args[1]) ? 0 : args[1];
		let widthxheight = delay > 0 ? args[2] : args[1],
			width = 1200,
			height = 800;
		if (widthxheight) {
			width = widthxheight.split('x')[0];
			height = widthxheight.split('x')[1];
		}
		let finalString = `Screenshot of <${website}> | ${widthxheight || '1200x800'}`;
		if (parseInt(delay) > 0) finalString += ` | Delay: ${delay}ms`;
		try {
			let { body } = await get(
				`https://shot.screenshotapi.net/screenshot?&url=${website}&output=image&file_type=png&delay=${delay}&width=${width}&height=${height}`
			);
			message.channel.send(finalString, { files: [{ attachment: body, name: 'screenshot.png' }] });
		} catch (error) {
			message.channel.send(error.message);
		}
	}
};

// const serverConfig = await ModelServer.findOne({ server: message.guild.id });
// let langcode = serverConfig.lang;
// let { util } = require(`../../utils/lang/${langcode}.js`);
// if (!args[0]) return;
// if (!message.channel.nsfw) return message.channel.send(util.nsfw);
// let msg = await message.channel.send(util.loading);
// try {
// 	let width = 1200;
// 	let height = 800;
// 	let dark = false;
// 	args.forEach((arg) => {
// 		if (arg === args[0]) return;
// 		switch (typeof JSON.parse(arg)) {
// 			case 'number':
// 				// eslint-disable-next-line no-case-declarations
// 				let index = args.indexOf(arg);
// 				if (index == 1) width = Number(arg);
// 				else if (index == 2) height = Number(arg);
// 				break;
// 			case 'boolean':
// 				dark = Boolean(arg);
// 				break;
// 		}
// 	});
// 	let options = {
// 		width: width,
// 		height: height,
// 		type: 'jpeg',
// 		quality: 0,
// 		darkMode: dark,
// 		launchOptions: {
// 			args: ['--no-sandbox', '--disable-setuid-sandbox']
// 		}
// 	};
// 	let website = args[0].includes('http') ? args[0] : `https://${args[0]}.com`;
// 	let buffer = await captureWebsite.buffer(website, options);

// 	msg.delete();
// 	let embed = new MessageEmbed()
// 		.setTitle(website)
// 		.setURL(website)
// 		.attachFiles([{ name: 'screenshot.jpeg', attachment: buffer }])
// 		.setImage('attachment://screenshot.jpeg')
// 		.setFooter(`⏰ ${((Date.now() - message.createdTimestamp) / 1000).toFixed(2)}s`);
// 	message.channel.send(embed);
// } catch (err) {
// 	console.error(err);
// 	message.channel.send(err.message, { code: 'js' });
// }
