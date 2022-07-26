/* eslint-disable no-undef */
import { load } from 'cheerio';
import request from 'node-superfetch';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findWithAttr(array: any[], attr: string, value: string) {
	// eslint-disable-next-line no-var
	for (var i = 0; i < array.length; i += 1) if (array[i][attr] === value) return i;

	return -1;
}
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'image',
	description: 'Search an image in Google',
	aliases: ['img', 'imgsearch'],
	cooldown: 3,
	category: 'utility',
	required_args: [{ index: 0, name: 'query', type: 'string' }],
	async execute(_client, message, args, guildConf) {
		let search = args.join(' ');

		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		try {
			let { text } = await request.get({
				url: `https://www.google.com/search?q=${search}&tbm=isch&ie=UTF-8&safe=active`,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
					'Content-Type': 'application/json'
				}
			});

			let $ = load(text!);
			let images = $('div[class="islrtb isv-r"]');
			let urls: { name: string; img: string; site: string; site_url: string }[] = [];

			Object.keys(images)
				.slice(0, 20)
				.forEach(function (key) {
					let val = images[key as unknown as number];
					if (val.attribs) urls.push({ name: val.attribs['data-pt'], img: val.attribs['data-ou'], site: val.attribs['data-st'], site_url: val.attribs['data-ru'] });
				});

			let image = urls[0];
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				new ButtonBuilder().setCustomId('dobleleft').setEmoji({ id: '882631909442744350' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('left').setEmoji({ id: '882626242459861042' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('right').setEmoji({ id: '882626290253959258' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('dobleright').setEmoji({ id: '882631788550324295' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('crossx').setEmoji({ id: '882639143874723932' }).setStyle(ButtonStyle.Danger)
			]);
			let embed = new EmbedBuilder()
				.setTitle(util.image.title)
				.setDescription(`[${image.name}](${image.site_url}) (${image.site})`)
				.setImage(image.img)
				.setColor('Random')

				.setFooter({
					text: util.image.footer + `${findWithAttr(urls, 'img', image.img) + 1}/${urls.length}`,
					iconURL: 'https://cdn.discordapp.com/emojis/749389813274378241.png?v=1'
				});
			message.channel.send({ embeds: [embed], components: [row] }).then((msg) => {
				let url;

				const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
				const collector = msg.createMessageComponentCollector({ filter, time: 60000, componentType: ComponentType.Button });
				collector.on('collect', async (reaction) => {
					url = msg.embeds[0].image ? msg.embeds[0].image.url : urls[0].img;
					msg = await message.channel.messages.fetch(msg.id);
					let newUrl;
					let embed;
					switch (reaction.customId) {
						case 'dobleleft':
							newUrl = urls[findWithAttr(urls, 'img', url) - 10] ? urls[findWithAttr(urls, 'img', url) - 10] : urls[0];
							embed = EmbedBuilder.from(msg.embeds[0])
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
							embed = EmbedBuilder.from(msg.embeds[0])
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
							embed = EmbedBuilder.from(msg.embeds[0])
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
							embed = EmbedBuilder.from(msg.embeds[0])
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
			});
		} catch (err) {
			console.error(err);
			message.channel.send(music.not_found);
		}
	}
});
