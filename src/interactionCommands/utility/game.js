/* eslint-disable no-unused-vars */
const request = require('node-superfetch');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

// async function getGameSearch(query) {
// 	let { body } = await request.get(
// 		`https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/US/en/99/${encodeURI(query)}?size=10&suggested_size=5&mode=game`
// 	);
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

module.exports = {
	name: 'game',
	description: 'Search for a game in Steam',
	ESdesc: 'Busca un juego en Steam',
	usage: 'game [ps] <search>',
	example: 'game ps Bloodborne\ngame sword art online -search',
	cooldown: 5,
	type: 1,
	async execute(client, interaction, guildConf) {
		interaction.deferReply();
		let { util, music } = require(`../../utils/lang/${guildConf.lang}.js`);

		let steamGame = interaction.options?.getString('query');
		let result;
		let appId;
		if (interaction.options?.getBoolean('confirm-result')) {
			result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
			if (result.body.total == 0) return interaction.editReply({ content: util.game.not_found, ephemeral: true });

			let options = [];
			for (let index = 0; index < result.body.items.length; index++) {
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
					`${result.body.items
						.map((res) => `**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`)
						.join('\n')}\n ${util.anime.type_a_number}`
				);
			let msg = await interaction.channel.send({ embeds: [embedSearch], components: [row] });
			const filter = (int) => int.customId === 'game' && int.user.id === interaction.user.id;
			try {
				let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
				appId = selected.values[0];
				msg.delete();
			} catch (error) {
				if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel, ephemeral: true });
				else interaction.reply({ content: music.cancel, ephemeral: true });
				return msg.delete();
			}
			// appId = result.body.items[gameIndex - 1].id;
		} else {
			result = await request.get(`http://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
			if (result.body.total == 0) return interaction.editReply({ content: util.game.not_found, ephemeral: true });
			appId = result.body.items[0].id;
		}
		let tags = [];
		let steamDLCs = [];
		let { body } = await request.get(`http://store.steampowered.com/api/appdetails?appids=${appId}&l=${guildConf.lang === 'es' ? 'spanish' : 'english'}`);
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
				.addField(util.game.publishers, data.publishers.join(', ') || 'No')

				.setFooter({ text: 'Steam Store' });
			interaction.editReply({ embeds: [embed] });
			interaction.message?.delete();
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
							.addField(util.game.publishers, data.publishers.join(', ') || 'No', false)
							.addField('DLCs', `${steamDLCs[0] ? steamDLCs.join('\n') : 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`, false)

							.setFooter({ text: 'Steam Store' });
						interaction.editReply({ embeds: [embed] });
						interaction.message?.delete();
					}
				}
			});
	}
};
