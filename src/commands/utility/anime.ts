/* eslint-disable no-case-declarations */
// function replaceAll(str, obj) {
// 	for (var key in obj) {
// 		let regexp = new RegExp(`\\${key}`, 'g');
// 		str = str.replace(regexp, obj[key]);
// 	}

// 	return str;
// }

import request from 'node-superfetch';
import cheerio, { CheerioAPI } from 'cheerio';
import { matchSorter } from 'match-sorter';
//editado de mal-scraper
interface anime {
	title: string;
	picture: string;
	type: string;
	episodes: string;
	status: string;
	studios: string[];
	source: string;
	aired: string;
	genres: string[];
	duration: string;
	score: string;
	ranked: string;
	popularity: string;
	id: number;
	url: string;
}

const getFromBorder = ($: CheerioAPI, t: string) => {
	return $(`span:contains("${t}")`).parent().text().trim().split(' ').slice(1).join(' ').split('\n')[0].trim();
};
const parsePage = (data: Buffer) => {
	const $ = cheerio.load(data);
	const result: anime = {
		title: '',
		picture: '',
		type: '',
		episodes: '',
		status: '',
		studios: [],
		source: '',
		aired: '',
		genres: [],
		duration: '',
		score: '',
		ranked: '',
		popularity: '',
		id: 0,
		url: ''
	};

	// We have to do this because MAL sometimes set the english title just below the japanese one
	// Example:
	//    - with: https://myanimelist.net/anime/30654/Ansatsu_Kyoushitsu_2nd_Season
	//    - without: https://myanimelist.net/anime/20047/Sakura_Trick
	$('div[itemprop="name"] br').remove();
	$('div[itemprop="name"] span').remove();

	result.title = $('.title-name').text();
	result.picture = $(`img[itemprop="image"]`).attr('data-src')!;

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

async function getInfoFromURL(url: string) {
	if (!url || typeof url !== 'string' || !url.toLocaleLowerCase().includes('myanimelist')) return;

	url = encodeURI(url);

	let { body } = await request.get(url);
	const res = parsePage(body as Buffer);
	res.id = +url.split(/\/+/)[3];
	return res;
}

interface Payload {
	media_type?: string;
	start_year?: number;
	aired?: string;
	score?: string;
	status?: 'none' | 'finished' | 'currently' | 'not-aired';
}
interface SearchResultsDataModel {
	id: string;
	type: string;
	name: string;
	image_url?: string;
	thumbnail_url?: string;
	es_score?: number;
	payload?: Payload;
	url: string;
}

async function getResultsFromSearch(keyword: string) {
	let { body } = await request.get('https://myanimelist.net/search/prefix.json?type=anime&keyword=' + keyword);
	const items: SearchResultsDataModel[] = [];
	if (!(body as { categories: { items: SearchResultsDataModel[] }[] }).categories) return;
	(body as { categories: { items: SearchResultsDataModel[] }[] }).categories.forEach((elem) => {
		elem.items.forEach((item) => {
			items.push(item);
		});
	});
	return items;
}

async function getInfoFromName(name: string, getBestMatch = true) {
	if (!name || typeof name !== 'string') return;

	let items = await getResultsFromSearch(name);

	if (!items || !items.length) return;

	try {
		const bestMatch = getBestMatch ? matchSorter(items, name, { keys: ['name'] })[0] : items[0];
		const url = bestMatch ? bestMatch.url : items[0].url;
		const data = await getInfoFromURL(url);

		data!.url = url;

		return data;
	} catch (e) {
		console.error(e);
	}
}
import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'anime',
	description: 'Search for an anime in myanimelist',
	category: 'utility',
	required_args: [{ index: 0, name: 'anime', type: 'string' }],
	async execute(client, message, args, guildConf) {
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let anime = args.join(' ');
		let data;

		if (message.content.toLowerCase().includes('-search')) {
			let results = await getResultsFromSearch(anime);
			if (!results) return;
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
				.setDescription(`${results.map((result) => `**${results!.indexOf(result) + 1} -** [${result.name}](${result.url})`).join('\n')}`);
			let msg = await message.channel.send({ embeds: [searchEmbed], components: [row] });
			const filter = (int: SelectMenuInteraction) => int.customId === 'anime' && int.user.id === message.author.id;
			try {
				let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
				data = await getInfoFromURL(`https://myanimelist.net/anime/${selected.values[0]}`);
				msg.delete();
			} catch (error) {
				message.channel.send({ content: music.cancel });
				return msg.delete();
			}
		} else data = await getInfoFromName(anime);

		if (!data) return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });
		let embed = new MessageEmbed()

			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(`${data.score} ⭐`)
			.setThumbnail(data.picture)
			.setColor('RANDOM')

			.addField(util.anime.episodes, data.episodes, true)
			.addField(util.anime.status, data.status, true)
			.addField(util.anime.aired, data.aired, true)
			.addField(util.anime.genre, data.genres.join(', ') || 'No', true)
			.addField(util.anime.studio, data.studios.join(', ') || 'No', true)
			.addField(util.anime.source, data.source, true)
			.addField(util.anime.duration, data.duration, true)
			.addField(util.anime.ranking, data.ranked, true)
			.addField(util.anime.popularity, data.popularity, true)

			.setFooter({ text: util.anime.footer });

		message.channel.send({ embeds: [embed] });
	}
});
