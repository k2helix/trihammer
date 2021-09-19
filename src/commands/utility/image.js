/* eslint-disable no-undef */
const cheerio = require('cheerio');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
function findWithAttr(array, attr, value) {
	for (var i = 0; i < array.length; i += 1) if (array[i][attr] === value) return i;

	return -1;
}
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'image',
	description: 'Search an image in Google',
	ESdesc: 'Busca una imagen en Google',
	usage: 'image <search>',
	example: 'image hotdog',
	aliases: ['img', 'imgsearch'],
	cooldown: 3,
	type: 1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		let search = args.join(' ');
		if (!search) return;

		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { util, music } = require(`../../utils/lang/${langcode}.js`);
		try {
			let { text } = await request.get(`https://www.google.com/search?q=${search}&tbm=isch&ie=UTF-8&safe=active`, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
					'Content-Type': 'application/json'
				}
			});

			let $ = cheerio.load(text);
			let images = $('div[class="islrtb isv-r"]');
			let urls = [];

			Object.keys(images).forEach(function (key) {
				if (Number(key) > 19) return;
				var val = images[key];
				if (val.attribs) urls.push({ name: val.attribs['data-pt'], img: val.attribs['data-ou'], site: val.attribs['data-st'], site_url: val.attribs['data-ru'] });
			});

			let image = urls[0];

			let embed = new MessageEmbed()
				.setTitle(util.image.title)
				.setDescription(`[${image.name}](${image.site_url}) (${image.site})`)
				.setImage(image.img)
				.setColor('RANDOM')

				.setFooter(util.image.footer + `${findWithAttr(urls, 'img', image.img) + 1}/${urls.length}`, 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1');
			message.channel.send({ embeds: [embed] }).then((msg) => {
				msg.react('⏮️');
				msg.react('⬅️');
				msg.react('➡️');
				msg.react('⏭️');
				const filter = (reaction, user) => {
					return ['⏮️', '⬅️', '➡️', '⏭️'].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				const collector = msg.createReactionCollector({ filter, time: 60000 });
				collector.on('collect', async (reaction) => {
					url = msg.embeds[0].image ? msg.embeds[0].image.url : urls[0].img;
					msg = await message.channel.messages.fetch(msg.id);
					let newUrl;
					let embed;
					switch (reaction.emoji.name) {
						case '⏮️':
							newUrl = urls[findWithAttr(urls, 'img', url) - 10] ? urls[findWithAttr(urls, 'img', url) - 10] : urls[0];
							embed = new MessageEmbed(msg.embeds[0])
								.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
								.setImage(newUrl.img)
								.setFooter(util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`, 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1');
							msg.edit({ embeds: [embed] });
							break;
						case '⬅️':
							newUrl = urls[findWithAttr(urls, 'img', url) - 1] ? urls[findWithAttr(urls, 'img', url) - 1] : urls[urls.length - 1];
							embed = new MessageEmbed(msg.embeds[0])
								.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
								.setImage(newUrl.img)
								.setFooter(util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`, 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1');
							msg.edit({ embeds: [embed] });
							break;
						case '➡️':
							newUrl = urls[findWithAttr(urls, 'img', url) + 1] ? urls[findWithAttr(urls, 'img', url) + 1] : urls[0];
							embed = new MessageEmbed(msg.embeds[0])
								.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
								.setImage(newUrl.img)
								.setFooter(util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`, 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1');
							msg.edit({ embeds: [embed] });
							break;
						case '⏭️':
							newUrl = urls[findWithAttr(urls, 'img', url) + 10] ? urls[findWithAttr(urls, 'img', url) + 10] : urls[urls.length - 1];
							embed = new MessageEmbed(msg.embeds[0])
								.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
								.setImage(newUrl.img)
								.setFooter(util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`, 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1');
							msg.edit({ embeds: [embed] });
							break;
					}
				});
				collector.on('end', () => {
					msg.reactions.removeAll();
				});
			});
		} catch (err) {
			console.error(err);
			message.channel.send(music.not_found);
		}
	}
};
