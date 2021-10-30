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
	$('span[itemprop="name"] br').remove();
	$('span[itemprop="name"] span').remove();

	result.title = $('span[itemprop="name"]').first().text();
	result.picture = $(`img[itemprop="image"][alt="${result.title}"]`).attr('data-src');

	// Parsing left border.
	result.type = getFromBorder($, 'Type:');
	result.volumes = getFromBorder($, 'Volumes:');
	result.status = getFromBorder($, 'Status:');
	result.published = getFromBorder($, 'Published:');
	result.authors = getFromBorder($, 'Authors:');
	result.chapters = getFromBorder($, 'Chapters:');
	result.genres = getFromBorder($, 'Genres:')
		.split(', ')
		.map((elem) => elem.trim().slice(0, elem.trim().length / 2));
	result.score = getFromBorder($, 'Score:').split(' ')[0].slice(0, -1);
	result.ranked = getFromBorder($, 'Ranked:').split(' ')[0].slice(0, -1);
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
	let { body } = await request.get('https://myanimelist.net/search/prefix.json?type=manga&keyword=' + keyword);
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
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
module.exports = {
	name: 'manga',
	description: 'Search for a manga in myanimelist',
	ESdesc: 'Busca un manga en myanimelist',
	usage: 'manga <search>',
	example: 'manga akame ga kill\nmanga attack on titan -search',
	type: 1,
	async execute(client, interaction, guildConf) {
		interaction.deferReply();
		let { util, music } = require(`../../utils/lang/${guildConf.lang}.js`);

		let manga = interaction.options?.getString('query');
		let data;

		if (interaction.options?.getBoolean('confirm-result')) {
			let results = await getResultsFromSearch(manga);
			let options = [];
			for (let index = 0; index < results.length; index++) {
				const element = results[index];
				options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
			}
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('manga').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
			);
			let searchEmbed = new MessageEmbed()
				.setTitle(util.image.title)
				.setColor('RANDOM')
				.setDescription(`${results.map((result) => `**${results.indexOf(result) + 1} -** [${result.name}](${result.url})`).join('\n')}`);
			let msg = await interaction.channel.send({ embeds: [searchEmbed], components: [row] });
			const filter = (int) => int.customId === 'manga' && int.user.id === interaction.user.id;
			try {
				let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
				data = await getInfoFromURL(`https://myanimelist.net/manga/${selected.values[0]}`);
				msg.delete();
			} catch (error) {
				if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel, ephemeral: true });
				else interaction.reply({ content: music.cancel, ephemeral: true });
				return msg.delete();
			}
		}

		if (!interaction.isSelectMenu() && !interaction.options?.getBoolean('confirm-result')) data = await getInfoFromName(manga);
		if (!data) return interaction.reply({ content: music.not_found, ephemeral: true });

		let embed = new MessageEmbed()
			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(`${data.score} ⭐`)
			.setThumbnail(data.picture)
			.setColor('RANDOM')
			.addField(util.manga.type, data.type, true)
			.addField(util.manga.volumes, data.volumes, true)
			.addField(util.manga.chapters, data.chapters, true)
			.addField(util.manga.author, data.authors, true)
			.addField(util.manga.published, data.published, true)
			.addField(util.manga.genre, data.genres.join(', ') || 'No', true)
			.addField(util.manga.status, data.status, true)
			.addField(util.manga.ranking, data.ranked, true)
			.addField(util.manga.popularity, data.popularity, true);

		interaction.editReply({ embeds: [embed] });
		interaction.message?.delete();
	}
};
