/* eslint-disable curly */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import request from 'node-superfetch';
import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

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

export default new Command({
	name: 'game',
	description: 'Search for a game in Steam',
	cooldown: 5,
	category: 'utility',
	execute(_client, interaction, guildConf) {
		interaction.deferReply().then(async () => {
			const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
			// not rewriting this, lol
			try {
				let steamGame = (interaction as ChatInputCommandInteraction).options.getString('query')!;
				// @ts-ignore
				let result;
				let appId;
				if ((interaction as ChatInputCommandInteraction).options.getBoolean('confirm-result')) {
					result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
					// @ts-ignore
					if (result.body.total == 0) return interaction.editReply({ content: util.game.not_found, ephemeral: true });

					let options = [];
					// @ts-ignore
					for (let index = 0; index < result.body.items.length; index++) {
						// @ts-ignore
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
							// @ts-ignore
							`${result.body.items
								// @ts-ignore
								.map((res) => `**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`)
								.join('\n')}\n ${util.anime.type_a_number}`
						);

					let msg = await interaction.channel!.send({ embeds: [embedSearch], components: [row] });
					const filter = (int: SelectMenuInteraction) => int.customId === 'game' && int.user.id === interaction.user.id;
					try {
						let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
						appId = selected.values[0];
						msg.delete();
					} catch (error) {
						if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel });
						else interaction.reply({ content: music.cancel, ephemeral: true });
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
				let steamDLCs: string[] = [];
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
					let embed = new EmbedBuilder()
						.setTitle(data.name)
						.setDescription(data.short_description)
						.setImage(data.header_image)
						.setColor('Random')
						.addFields(
							{ name: util.game.release, value: data.release_date.date },
							{ name: util.game.genres, value: tags.join(', ') },
							{ name: util.game.price, value: price },
							{ name: util.game.publishers, value: data.publishers.join(', ') || 'No' }
						)
						.setFooter({ text: 'Steam Store' });
					interaction.editReply({ embeds: [embed] });
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
								let embed = new EmbedBuilder()
									.setTitle(data.name)
									.setDescription(data.short_description)
									.setImage(data.header_image)
									.setColor('Random')
									.addFields(
										{ name: util.game.release, value: data.release_date.date },
										{ name: util.game.genres, value: tags.join(', ') },
										{ name: util.game.price, value: price },
										{ name: util.game.publishers, value: data.publishers.join(', ') || 'No' },
										{ name: 'DLCs', value: `${steamDLCs.join('\n') || 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`, inline: false }
									)
									.setFooter({ text: 'Steam Store' });
								interaction.editReply({ embeds: [embed] });
							}
						}
					});
				}
			} catch (err) {
				return interaction.editReply(util.game.not_found);
			}
		});
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
