/* eslint-disable no-case-declarations */
// function replaceAll(str, obj) {
// 	for (var key in obj) {
// 		let regexp = new RegExp(`\\${key}`, 'g');
// 		str = str.replace(regexp, obj[key]);
// 	}

// 	return str;
// }

const request = require('node-superfetch');
const cheerio = require('cheerio');
const { matchSorter } = require('match-sorter');
//editado de mal-scraper
const getFromBorder = ($, t) => {
	return $(`span:contains("${t}")`).parent().text().trim().split(' ').slice(1).join(' ').split('\n')[0].trim();
};
const parsePage = (data) => {
	const $ = cheerio.load(data);
	const result = {};

	// We have to do this because MAL sometimes set the english title just below the japanese one
	// Example:
	//    - with: https://myanimelist.net/anime/30654/Ansatsu_Kyoushitsu_2nd_Season
	//    - without: https://myanimelist.net/anime/20047/Sakura_Trick
	$('div[itemprop="name"] br').remove();
	$('div[itemprop="name"] span').remove();

	result.title = $('.title-name').text();
	result.picture = $(`img[itemprop="image"]`).attr('data-src');

	// Parsing left border.
	result.type = getFromBorder($, 'Type:');
	result.episodes = getFromBorder($, 'Episodes:');
	result.status = getFromBorder($, 'Status:');
	result.aired = getFromBorder($, 'Aired:');
	result.studios = getFromBorder($, 'Studios:').split(',       ');
	result.source = getFromBorder($, 'Source:');
	result.genres = getFromBorder($, 'Genres:')
		.split(', ')
		.map((elem) => elem.trim().slice(0, elem.trim().length / 2));
	result.duration = getFromBorder($, 'Duration:');
	result.score = getFromBorder($, 'Score:').split(' ')[0].slice(0, -1);
	result.ranked = getFromBorder($, 'Ranked:').slice(0, -1);
	result.popularity = getFromBorder($, 'Popularity:');

	return result;
};

async function getInfoFromURL(url) {
	if (!url || typeof url !== 'string' || !url.toLocaleLowerCase().includes('myanimelist')) return;

	url = encodeURI(url);

	let { body } = await request.get(url);
	const res = parsePage(body);
	res.id = +url.split(/\/+/)[3];
	return res;
}

async function getResultsFromSearch(keyword) {
	let { body } = await request.get('https://myanimelist.net/search/prefix.json?type=anime&keyword=' + keyword);
	const items = [];
	if (!body.categories) return;
	body.categories.forEach((elem) => {
		elem.items.forEach((item) => {
			items.push(item);
		});
	});
	return items;
}

async function getInfoFromName(name, getBestMatch = true) {
	if (!name || typeof name !== 'string') return;

	let items = await getResultsFromSearch(name);

	if (!items.length) return;

	try {
		const bestMacth = getBestMatch ? matchSorter(items, name, { keys: ['name'] })[0] : items[0];
		const url = bestMacth ? bestMacth.url : items[0].url;
		const data = await getInfoFromURL(url);

		data.url = url;

		return data;
	} catch (e) {
		/* istanbul ignore next */
		console.error(e);
	}
}
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
module.exports = {
	name: 'anime',
	description: 'Search for an anime in myanimelist',
	ESdesc: 'Busca un anime en myanimelist',
	usage: 'anime <name> [options]',
	example: 'anime akame ga kill\nanime re:zero -search\nanime (insert image) -screenshot',
	type: 1,
	async execute(client, interaction, guildConf) {
		interaction.deferReply();
		let { util, music } = require(`../../lib/utils/lang/${guildConf.lang}`);

		let anime = interaction.options?.getString('query');
		let data;

		if (interaction.options?.getBoolean('confirm-result')) {
			let results = await getResultsFromSearch(anime);
			let options = [];
			for (let index = 0; index < results.length; index++) {
				const element = results[index];
				options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
			}
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('anime').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
			);
			let searchEmbed = new MessageEmbed()
				.setTitle(util.image.title)
				.setColor('RANDOM')
				.setDescription(`${results.map((result) => `**${results.indexOf(result) + 1} -** [${result.name}](${result.url})`).join('\n')}`);
			let msg = await interaction.channel.send({ embeds: [searchEmbed], components: [row] });
			const filter = (int) => int.customId === 'anime' && int.user.id === interaction.user.id;
			try {
				let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
				data = await getInfoFromURL(`https://myanimelist.net/anime/${selected.values[0]}`);
				msg.delete();
			} catch (error) {
				if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel, ephemeral: true });
				else interaction.reply({ content: music.cancel, ephemeral: true });
				return msg.delete();
			}
		}
		// if (interaction.isSelectMenu() && interaction.message?.interaction.user.id !== interaction.user.id)
		// 	return interaction.reply({ content: `<@${interaction.user.id}> | ` + util.anime.you_cant });

		if (!interaction.isSelectMenu() && !interaction.options?.getBoolean('confirm-result')) data = await getInfoFromName(anime);
		if (!data) return interaction.reply({ content: music.not_found, ephemeral: true });
		// else if (interaction.isSelectMenu()) data = await getInfoFromURL(`https://myanimelist.net/anime/${interaction.values[0]}`);

		// if (interaction.isCommand() && !interaction.options?.getBoolean('confirm-result') && !data)
		// 	return interaction.reply({ content: music.not_found, ephemeral: true });
		// if (!data && !interaction.options?.getBoolean('confirm-result')) interaction.editReply({ content: music.not_found, ephemeral: true });
		// else if (!data) return interaction.editReply({ content: util.connect4.waiting });

		let embed = new MessageEmbed()

			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(`${data.score} ⭐`)
			.setThumbnail(data.picture)
			.setColor('RANDOM')

			.addField(util.anime.episodes, data.episodes, true)
			.addField(util.anime.status, data.status, true)
			.addField(util.anime.aired, data.aired, true)
			.addField(util.anime.genre, data.genres?.join(', ') || 'No', true)
			.addField(util.anime.studio, data.studios?.join(', ') || 'No', true)
			.addField(util.anime.source, data.source, true)
			.addField(util.anime.duration, data.duration, true)
			.addField(util.anime.ranking, data.ranked, true)
			.addField(util.anime.popularity, data.popularity, true)

			.setFooter({ text: util.anime.footer });

		interaction.editReply({ embeds: [embed] });
	}
};
