/* eslint-disable no-unused-vars */
/* eslint-disable require-await */
// const captureWebsite = require('capture-website');
// const { MessageEmbed } = require('discord.js');
// const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'screenshot',
	description: 'Take an screenshot of a website',
	ESdesc: 'Toma una captura de pantalla de un sitio web',
	usage: 'screenshot <url> [width] [height] [dark mode]',
	example: 'screenshot https://discord.com 1920 1080 true\nscreenshot https://discord.com 1920 1080 false',
	cooldown: 10,
	aliases: ['ss'],
	type: 1,
	async execute(client, message, args) {
		return message.channel.send('Command disabled');
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
	}
};
