/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import request from 'node-superfetch';
import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

// async function getGameSearch(query) {
// 	let { body } = await request.get(`https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/US/en/99/${encodeURI(query)}?size=10&suggested_size=5&mode=game`);
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
// 	let { body } = await request.get(`https://store.playstation.com/valkyrie-api/en/US/999/resolve/${searchResults[0].id}`);

// 	let game = body.included[0].attributes;
// 	let DLCs = body.included.filter((each) => each.attributes['kamaji-relationship'] === 'add-ons');
// 	if (game.parent) {
// 		let { body } = await request.get(`https://store.playstation.com/valkyrie-api/en/US/999/resolve/${game.parent.id}`);
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
		// not rewriting this, lol
		try {
			let steamGame = args.join(' ');
			// @ts-ignore
			let result;
			let appId;
			if (steamGame.toLowerCase().includes('-search')) {
				let index = steamGame.indexOf('-search');
				steamGame = steamGame.slice(0, index);
				result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
				// @ts-ignore
				if (result.body.total == 0) return message.channel.send({ embeds: [client.redEmbed(util.game.not_found)] });

				let options = [];
				// @ts-ignore
				for (let index = 0; index < result.body.items.length; index++) {
					// @ts-ignore
					const element = result.body.items[index];
					options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
				}

				const row = new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId('game').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
				);

				let embedSearch = new MessageEmbed()
					.setTitle(util.image.title)
					.setColor('RANDOM')
					.setDescription(
						// @ts-ignore
						`${result.body.items
							// @ts-ignore
							.map((res) => `**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`)
							.join('\n')}\n ${util.anime.type_a_number}`
					);

				let msg = await message.channel.send({ embeds: [embedSearch], components: [row] });
				const filter = (int: SelectMenuInteraction) => int.customId === 'game' && int.user.id === message.author.id;
				try {
					let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
					appId = selected.values[0];
					msg.delete();
				} catch (error) {
					message.channel.send({ content: music.cancel });
					return msg.delete();
				}
			} else {
				// @ts-ignore
				result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
				// @ts-ignore
				appId = result.body.items[0].id;
			}
			// @ts-ignore
			let tags: string[] = [];
			// @ts-ignore
			let steamDLCs = [];
			let { body } = await request.get(`http://store.steampowered.com/api/appdetails?appids=${appId}&l=${guildConf.lang === 'es' ? 'spanish' : 'english'}`);
			// @ts-ignore
			let data = body[appId].data;
			let price = data.price_overview ? data.price_overview.final_formatted : '???';
			if (!data.price_overview)
				if (data.is_free) price = '$0.00';
				else price = '???';

			data.genres.forEach((genre: { description: string }) => {
				tags.push(genre.description);
			});
			if (!data.dlc) {
				let embed = new MessageEmbed()
					.setTitle(data.name)
					.setDescription(data.short_description)
					.setImage(data.header_image)
					.setColor('RANDOM')

					.addField(util.game.release, data.release_date.date)
					// @ts-ignore
					.addField(util.game.genres, tags.join(', '))
					.addField(util.game.price, price)
					.addField(util.game.publishers, data.publishers.join(', ') || 'No')

					.setFooter({ text: 'Steam Store' });
				message.channel.send({ embeds: [embed] });
				// eslint-disable-next-line curly
			} else {
				// @ts-ignore
				data.dlc.forEach(async (dlc) => {
					if (data.dlc.indexOf(dlc) < 4) {
						let { body } = await request.get('https://store.steampowered.com/api/appdetails?appids=' + dlc);
						// @ts-ignore
						let dlcprice = body[dlc].data.price_overview ? body[dlc].data.price_overview.final_formatted : '???';
						// @ts-ignore
						if (!body[dlc].data.price_overview) {
							// @ts-ignore
							if (body[dlc].data.is_free) dlcprice = '$0.00';
							else dlcprice = '???';
						}

						// @ts-ignore
						steamDLCs.push(`${body[dlc].data.name} (${dlcprice})`);
						let length = data.dlc.length < 3 ? data.dlc.length : 3;
						if (steamDLCs.length == length) {
							let embed = new MessageEmbed()
								.setTitle(data.name)
								.setDescription(data.short_description)
								.setImage(data.header_image)
								.setColor('RANDOM')

								.addField(util.game.release, data.release_date.date, true)
								.addField(util.game.genres, tags.join(', '), true)
								.addField(util.game.price, price, true)
								// @ts-ignore
								.addField(util.game.publishers, data.publishers.join(', ') || 'No', false)
								// @ts-ignore
								.addField('DLCs', `${steamDLCs[0] ? steamDLCs.join('\n') : 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`, false)

								.setFooter({ text: 'Steam Store' });
							message.channel.send({ embeds: [embed] });
						}
					}
				});
			}
		} catch (err) {
			return message.channel.send(util.game.not_found);
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

// let embed = new MessageEmbed()
// .setTitle(body.name)
// .setDescription('**'+Number(body.star_rating.score) * 2 + '** ⭐\n' + body.long_desc.replace(/<br\/>|<br>/gi, '\n').slice(0, 500) + '...')
// .setThumbnail(body.images[0].url)
// .setColor('RANDOM')
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
