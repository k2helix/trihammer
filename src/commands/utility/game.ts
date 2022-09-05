// @ts-nocheck
import request from 'node-superfetch';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	MessageOptions,
	SelectMenuBuilder,
	SelectMenuInteraction
} from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

const languages = {
	es: 'spanish',
	en: 'english'
};

// async function getGameSearch(query) {
// 	let { body } = await request.get({ url: `https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/US/en/99/${encodeURI(query)}?size=10&suggested_size=5&mode=game`);
// 	let results = [];
// 	for (let index = 0; index < body.links.length; index++) {
// 		const game = body.links[index];
// 		let gameInfo = {
// 			name: game.name,
// 			id: game.id
// 		};
// 		results.push(gameInfo);
// 	}
// 	return results;
// }

// async function getGameResults(query) {
// 	let searchResults = await getGameSearch(query);
// 	if (!searchResults[0]) return { game: null, DLCs: null };
// 	let { body } = await request.get({ url: `https://store.playstation.com/valkyrie-api/en/US/999/resolve/${searchResults[0].id}`);

// 	let game = body.included[0].attributes;
// 	let DLCs = body.included.filter((each) => each.attributes['kamaji-relationship'] === 'add-ons');
// 	if (game.parent) {
// 		let { body } = await request.get({ url: `https://store.playstation.com/valkyrie-api/en/US/999/resolve/${game.parent.id}`);
// 		game = body.included.find((inc) => inc.attributes['game-content-type'] === 'Full Game').attributes;
// 		DLCs = body.included.filter((each) => each.attributes['kamaji-relationship'] === 'add-ons');
// 	}

// 	return { game, DLCs };
// }

export default new MessageCommand({
	name: 'game',
	description: 'Search for a game in Steam',
	cooldown: 5,
	required_args: [{ index: 0, name: 'game', type: 'string' }],
	category: 'utility',
	async execute(client, message, args, guildConf) {
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		try {
			let isSearch = message.content.toLowerCase().includes('-search');
			let steamGame = isSearch ? args.join(' ').slice(0, args.join(' ').indexOf('-search')) : args.join(' ');
			let result = await request.get(`https://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
			if (result.body.total == 0) return message.channel.send({ embeds: [client.redEmbed(util.game.not_found)] });

			let appId;
			if (isSearch) {
				let options = [];
				for (let index = 0; index < result.body.items.length; index++) {
					const element = result.body.items[index];
					options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
				}

				const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
					new SelectMenuBuilder().setCustomId('game').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
				);

				let embedSearch = new EmbedBuilder()
					.setTitle(util.image.title)
					.setColor('Random')
					.setDescription(
						`${result.body.items
							.map((res) => `**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`)
							.join('\n')}\n ${util.anime.type_a_number}`
					);

				let msg = await message.channel.send({ embeds: [embedSearch], components: [row] });
				const filter = (int: SelectMenuInteraction) => int.customId === 'game' && int.user.id === message.author.id;
				try {
					let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
					appId = selected.values[0];
					msg.delete();
				} catch (error) {
					message.channel.send({ content: music.cancel });
					return msg.delete();
				}
			} else appId = result.body.items[0].id;

			let { body } = await request.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=${languages[guildConf.lang as 'es' | 'en']}`);
			let data = body[appId].data;
			let steamDLCs: string[] = [];

			let embed = new EmbedBuilder()
				.setTitle(data.name)
				.setDescription(data.short_description)
				.setImage(data.header_image)
				.setColor('Random')
				.addFields(
					{ name: util.game.release, value: data.release_date.date, inline: true },
					{ name: util.game.genres, value: data.genres.map((g) => g.description).join(', '), inline: true },
					{ name: '​', value: '​', inline: true },
					{ name: util.game.price, value: data.is_free ? '$0.00' : data.price_overview?.final_formatted || '???', inline: true },
					{ name: util.game.publishers, value: data.publishers.join(', ') || 'No', inline: true },
					{ name: '​', value: '​', inline: true }
				)
				.setFooter({ text: 'Steam Store' });

			let info: MessageOptions = { embeds: [embed] };
			let row: ActionRowBuilder<ButtonBuilder>;

			if (data.dlc) {
				row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('dlcs').setLabel(util.game.show_dlcs).setStyle(ButtonStyle.Primary));
				info.components = [row];
			}
			let msg = await message.channel.send(info);
			if (info.components) {
				const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
				const collector = msg.createMessageComponentCollector({ filter, time: 30000, componentType: ComponentType.Button });
				collector.on('collect', async (reaction) => {
					for (let index = 0; index < data.dlc.length; index++)
						if (index <= 3) {
							const dlcId = data.dlc[index];
							let dlc = (await request.get('https://store.steampowered.com/api/appdetails?appids=' + dlcId)).body[dlcId].data;
							steamDLCs.push(`${dlc.name} (${dlc.is_free ? '$0.00' : dlc.price_overview?.final_formatted || '???'})`);
						}
					reaction.update({
						embeds: [
							embed.addFields({
								name: 'DLCs',
								value: `${steamDLCs.join('\n') || 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`,
								inline: false
							})
						],
						components: []
					});
					collector.stop('Button pressed');
				});
				collector.on('end', () => {
					if (collector.endReason !== 'Button pressed') msg.edit({ components: [] }).catch(() => null);
				});
			}
		} catch (err) {
			console.log(err);
			return message.channel.send({ embeds: [client.redEmbed(util.game.not_found)] });
		}
	}
});

//ps4 search
//   try {
// let baseurl = 'http://store.playstation.com/en-GB/grid/search-game/1?query='
// if(guildConf.lang === 'es') baseurl = "http://store.playstation.com/es-es/grid/search-game/1?query="

// let {text} = await request.get(baseurl + game)
// let txt = text.slice(text.indexOf('{'), text.indexOf('}'))
// let json = txt + '}]}]}'
// let data = JSON.parse(json)
// let img = data['@graph'][0].image
// let url = img.slice(0, img.indexOf('image'))
// let {body} = await request.get(url)
// let tags =[]

// body.content_descriptors.forEach(desc => {
// tags.push(desc.name)
// })

// let embed = new EmbedBuilder()
// .setTitle(body.name)
// .setDescription('**'+Number(body.star_rating.score) * 2 + '** ⭐\n' + body.long_desc.replace(/<br\/>|<br>/gi, '\n').slice(0, 500) + '...')
// .setThumbnail(body.images[0].url)
// .setColor('Random')
// .setURL('https://store.playstation.com/es-es/product/' + body.id)

// if(guildConf.lang === 'es') {
//     embed.addField('Fecha de salida:', body.release_date)
//     embed.addField('Géneros:', tags.join(', '))
//     embed.addField('Precio:', body.default_sku.display_price)
// } else {
//     embed.addField('Release Date:', body.release_date)
//     embed.addField('Genres:', tags.join(', '))
//     embed.addField('Price:', body.default_sku.display_price)
// }
// embed.addField('DLCs:', !body.links.filter(link => link.top_category === 'add_on')[0] ? 'No' : body.links.filter(link => link.top_category === 'add_on').map(link => `[${link.name}](https://store.playstation.com/es-es/product/${link.id})`).slice(0, 5).join('\n') + '\n...')

// embed.setFooter('Play Station Store')
// message.channel.send(embed)
//   } catch (err) {
//     //search in steam if it isn't in ps store
//   console.log(err)
//   console.log('Game not found on PS Store')
