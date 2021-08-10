/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');

async function getGameSearch(query) {
	let { body } = await request.get(
		`https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/US/en/99/${encodeURI(query)}?size=10&suggested_size=5&mode=game`
	);
	let results = [];
	for (let index = 0; index < body.links.length; index++) {
		const game = body.links[index];
		let gameInfo = {
			name: game.name,
			id: game.id
		};
		results.push(gameInfo);
	}
	return results;
}

async function getGameResults(query) {
	let searchResults = await getGameSearch(query);
	if (!searchResults[0]) return { game: null, DLCs: null };
	let { body } = await request.get(`https://store.playstation.com/valkyrie-api/en/US/999/resolve/${searchResults[0].id}`);

	let game = body.included[0].attributes;
	let DLCs = body.included.filter((each) => each.attributes['kamaji-relationship'] === 'add-ons');
	if (game.parent) {
		let { body } = await request.get(`https://store.playstation.com/valkyrie-api/en/US/999/resolve/${game.parent.id}`);
		game = body.included.find((inc) => inc.attributes['game-content-type'] === 'Full Game').attributes;
		DLCs = body.included.filter((each) => each.attributes['kamaji-relationship'] === 'add-ons');
	}

	return { game, DLCs };
}

module.exports = {
	name: 'game',
	description: 'Search for a game in Steam or the PS Store',
	ESdesc: 'Busca un juego en Steam o en la PS Store',
	usage: 'game [ps] <search>',
	example: 'game ps Bloodborne\ngame sword art online -search',
	cooldown: 5,
	type: 1,
	async execute(client, message, args) {
		if (!args[0]) return;
		let serverConfig = await ModelServer.findOne({ server: message.guild.id });
		const langcode = serverConfig.lang;
		let { util, music } = require(`../../utils/lang/${langcode}.js`);

		switch (args[0]) {
			// case 'ps':
			// 	let { game, DLCs } = await getGameResults(args.slice(1).join(' '));
			// 	if (!game) return message.channel.send(util.game.not_found);
			// 	let DLCMap = DLCs.map((each) => `${each.attributes.name} (${each.attributes.skus[0].prices['non-plus-user']['actual-price'].display})`);

			// 	let embed = new MessageEmbed()
			// 		.setTitle(game.name)
			// 		.setColor('RANDOM')
			// 		.setImage(game['media-list'].screenshots[0].url)

			// 		.addField(util.game.release, game['release-date'])
			// 		.addField(util.game.genres, game.genres.join(', ') || 'No')
			// 		.addField('Size', `${game['file-size'].value}${game['file-size'].unit}`)
			// 		.addField(util.game.price, game.skus[0].prices['non-plus-user']['actual-price'].display)
			// 		.addField(util.game.publishers, game['provider-name'])
			// 		.addField('DLCs', `${DLCs[0] ? DLCMap.slice(0, 3).join('\n') : 'No'}${DLCMap.length > 3 ? `\n${DLCMap.length - 3} more...` : ''}`, false)

			// 		.setFooter('PS Store');
			// 	message.channel.send(embed);

			// 	break;

			default:
				try {
					let steamGame = args.join(' ');
					let result;
					let appId;
					if (steamGame.toLowerCase().includes('-search')) {
						let index = steamGame.indexOf('-search');
						steamGame = steamGame.slice(0, index);
						result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
						if (result.body.total == 0) return message.channel.send(util.game.not_found);

						let embedSearch = new MessageEmbed()
							.setTitle(util.image.title)
							.setColor('RANDOM')
							.setDescription(
								`${result.body.items
									.map(
										(res) =>
											`**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`
									)
									.join('\n')}\n ${util.anime.type_a_number}`
							);

						message.channel.send(embedSearch);
						try {
							var response = await message.channel.awaitMessages((msg) => msg.content > 0 && msg.content < result.body.total + 1, {
								max: 1,
								time: 10000,
								errors: ['time']
							});
						} catch (err) {
							console.error(err);
							return message.channel.send(music.cancel);
						}
						const gameIndex = parseInt(response.first().content);
						appId = result.body.items[gameIndex - 1].id;
					} else {
						result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
						appId = result.body.items[0].id;
					}
					let tags = [];
					let steamDLCs = [];
					let { body } = await request.get(
						`http://store.steampowered.com/api/appdetails?appids=${appId}&l=${langcode === 'es' ? 'spanish' : 'english'}`
					);
					let data = body[appId].data;
					let price = data.price_overview ? data.price_overview.final_formatted : '???';
					if (!data.price_overview)
						if (data.is_free) price = '$0.00';
						else price = '???';

					data.genres.forEach((genre) => {
						tags.push(genre.description);
					});
					if (!data.dlc) {
						let embed = new MessageEmbed()
							.setTitle(data.name)
							.setDescription(data.short_description)
							.setImage(data.header_image)
							.setColor('RANDOM')

							.addField(util.game.release, data.release_date.date)
							.addField(util.game.genres, tags.join(', '))
							.addField(util.game.price, price)
							.addField(util.game.publishers, data.publishers.join(', '))

							.setFooter('Steam Store');
						message.channel.send(embed);
					} else
						data.dlc.forEach(async (dlc) => {
							if (data.dlc.indexOf(dlc) < 4) {
								let { body } = await request.get('https://store.steampowered.com/api/appdetails?appids=' + dlc);
								let dlcprice = body[dlc].data.price_overview ? body[dlc].data.price_overview.final_formatted : '???';
								if (!body[dlc].data.price_overview)
									if (body[dlc].data.is_free) dlcprice = '$0.00';
									else dlcprice = '???';

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
										.addField(util.game.publishers, data.publishers.join(', '), false)
										.addField(
											'DLCs',
											`${steamDLCs[0] ? steamDLCs.join('\n') : 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`,
											false
										)

										.setFooter('Steam Store');
									message.channel.send(embed);
								}
							}
						});
				} catch (err) {
					return message.channel.send(util.game.not_found);
					// let { game, DLCs } = await getGameResults(args.join(' '));
					// if (!game) return message.channel.send(util.game.not_found);
					// let DLCMap = DLCs.map((each) => `${each.attributes.name} (${each.attributes.skus[0].prices['non-plus-user']['actual-price'].display})`);

					// let embed = new MessageEmbed()
					// 	.setTitle(game.name)
					// 	.setColor('RANDOM')
					// 	.setImage(game['media-list'].screenshots[0].url)

					// 	.addField(util.game.release, game['release-date'])
					// 	.addField(util.game.genres, game.genres.join(', ') || 'No')
					// 	.addField('Size', `${game['file-size'].value}${game['file-size'].unit}`)
					// 	.addField(util.game.price, game.skus[0].prices['non-plus-user']['actual-price'].display)
					// 	.addField(util.game.publishers, game['provider-name'])
					// 	.addField('DLCs', `${DLCs[0] ? DLCMap.slice(0, 3).join('\n') : 'No'}${DLCMap.length > 3 ? `\n${DLCMap.length - 3} more...` : ''}`, false)

					// 	.setFooter('PS Store');
					// message.channel.send(embed);
				}
				break;
		}
	}
};

//ps4 search
//   try {
// let baseurl = 'http://store.playstation.com/en-GB/grid/search-game/1?query='
// if(langcode === 'es') baseurl = "http://store.playstation.com/es-es/grid/search-game/1?query="

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

// if(langcode === 'es') {
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
