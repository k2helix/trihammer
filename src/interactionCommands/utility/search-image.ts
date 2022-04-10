const cheerio = require('cheerio');
const request = require('node-superfetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
function findWithAttr(array, attr, value) {
	for (var i = 0; i < array.length; i += 1) if (array[i][attr] === value) return i;

	return -1;
}
module.exports = {
	name: 'search-image',
	description: 'Search an image in Google',
	ESdesc: 'Busca una imagen en Google',
	usage: 'image <search>',
	example: 'image hotdog',
	aliases: ['img', 'imgsearch'],
	cooldown: 3,
	type: 1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let search = interaction.options.getString('query');
		let { util, music } = require(`../../lib/utils/lang/${guildConf.lang}`);
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
			if (!image) interaction.reply({ content: music.not_found, ephemeral: true });
			const row = new MessageActionRow().addComponents([
				new MessageButton().setCustomId('dobleleft').setEmoji('882631909442744350').setStyle('PRIMARY'),
				new MessageButton().setCustomId('left').setEmoji('882626242459861042').setStyle('PRIMARY'),
				new MessageButton().setCustomId('right').setEmoji('882626290253959258').setStyle('PRIMARY'),
				new MessageButton().setCustomId('dobleright').setEmoji('882631788550324295').setStyle('PRIMARY'),
				new MessageButton().setCustomId('crossx').setEmoji('882639143874723932').setStyle('DANGER')
			]);
			let embed = new MessageEmbed()
				.setTitle(util.image.title)
				.setDescription(`[${image.name}](${image.site_url}) (${image.site})`)
				.setImage(image.img)
				.setColor('RANDOM')

				.setFooter({
					text: util.image.footer + `${findWithAttr(urls, 'img', image.img) + 1}/${urls.length}`,
					iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
				});
			interaction.reply({ embeds: [embed], components: [row] });
			let msg = await interaction.fetchReply();
			let url;

			const filter = (int) => int.user.id === interaction.user.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
			collector.on('collect', async (reaction) => {
				url = msg.embeds[0].image ? msg.embeds[0].image.url : urls[0].img;
				msg = await interaction.channel.messages.fetch(msg.id);
				let newUrl;
				let embed;
				switch (reaction.customId) {
					case 'dobleleft':
						newUrl = urls[findWithAttr(urls, 'img', url) - 10] ? urls[findWithAttr(urls, 'img', url) - 10] : urls[0];
						embed = new MessageEmbed(msg.embeds[0])
							.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
							.setImage(newUrl.img)
							.setFooter({
								text: util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`,
								iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
							});
						reaction.update({ embeds: [embed] });
						break;
					case 'left':
						newUrl = urls[findWithAttr(urls, 'img', url) - 1] ? urls[findWithAttr(urls, 'img', url) - 1] : urls[urls.length - 1];
						embed = new MessageEmbed(msg.embeds[0])
							.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
							.setImage(newUrl.img)
							.setFooter({
								text: util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`,
								iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
							});
						reaction.update({ embeds: [embed] });
						break;
					case 'right':
						newUrl = urls[findWithAttr(urls, 'img', url) + 1] ? urls[findWithAttr(urls, 'img', url) + 1] : urls[0];
						embed = new MessageEmbed(msg.embeds[0])
							.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
							.setImage(newUrl.img)
							.setFooter({
								text: util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`,
								iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
							});
						reaction.update({ embeds: [embed] });
						break;
					case 'dobleright':
						newUrl = urls[findWithAttr(urls, 'img', url) + 10] ? urls[findWithAttr(urls, 'img', url) + 10] : urls[urls.length - 1];
						embed = new MessageEmbed(msg.embeds[0])
							.setDescription(`[${newUrl.name}](${newUrl.site_url}) (${newUrl.site})`)
							.setImage(newUrl.img)
							.setFooter({
								text: util.image.footer + `${findWithAttr(urls, 'img', newUrl.img) + 1}/${urls.length}`,
								iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
							});
						reaction.update({ embeds: [embed] });
						break;
					case 'crossx':
						reaction.update({ components: [] });
						break;
				}
			});
			collector.on('end', () => {
				msg.edit({ components: [] });
			});
		} catch (err) {
			console.error(err);
			interaction.channel.send(music.not_found);
		}
	}
};
