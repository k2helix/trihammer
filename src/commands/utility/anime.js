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
const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'anime',
	description: 'Search for an anime in myanimelist',
	ESdesc: 'Busca un anime en myanimelist',
	usage: 'anime <name> [options]',
	example: 'anime akame ga kill\nanime re:zero -search\nanime (insert image) -screenshot',
	type: 1,
	async execute(client, message, args) {
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		let { util, music } = require(`../../utils/lang/${langcode}.js`);
		let anime = args.join(' ');
		let data;

		switch (args[args.length - 1]) {
			case '-search':
				let index = anime.indexOf('-search');
				anime = anime.slice(0, index);

				let results = await getResultsFromSearch(anime);
				let searchEmbed = new MessageEmbed()
					.setTitle(util.image.title)
					.setColor('RANDOM')
					.setDescription(`${results.map((result) => `**${results.indexOf(result) + 1} -** [${result.name}](${result.url})`).join('\n')}\n ${util.anime.type_a_number}`);
				message.channel.send({ embeds: [searchEmbed] });
				try {
					let filter = (msg) => msg.content > 0 && msg.content < 11;
					var response = await message.channel.awaitMessages({
						filter,
						max: 1,
						time: 10000,
						errors: ['time']
					});
				} catch (err) {
					console.error(err);
					return message.channel.send(music.cancel);
				}
				const animeIndex = parseInt(response.first().content);
				data = await getInfoFromURL(results[animeIndex - 1].url);
				data.url = results[animeIndex - 1].url;
				break;
			// case '-screenshot':
			// 	// eslint-disable-next-line no-inner-declarations
			// 	function Time_convertor(ms) {
			// 		let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			// 		let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
			// 		let segundos = Math.floor((ms % (1000 * 60)) / 1000);

			// 		let final2 = '';
			// 		if (segundos < 10) segundos = '0' + segundos;
			// 		if (minutos < 10) minutos = '0' + minutos;
			// 		if (horas < 10) horas = '0' + horas;

			// 		if (segundos > 0) final2 += segundos > 1 ? `${minutos}:${segundos}` : `${minutos}:${segundos}`;
			// 		if (horas > 1) if (segundos > 0) final2 += segundos > 1 ? `${horas}:${minutos}:${segundos}` : `${horas}:${minutos}:${segundos}`;

			// 		return final2;
			// 	}

			// 	let image = args[0].startsWith('http') ? args[0] : message.attachments.array()[0];
			// 	if (!image) return message.channel.send(util.anime.screenshot.no_image);

			// 	try {
			// 		let msg = await message.channel.send(util.loading);
			// 		let { body } = await request.get(`https://trace.moe/api/search?url=${image === args[0] ? image : image.url}`);
			// 		let found = body.docs[0];
			// 		let all = body.docs
			// 			.filter((anm) => anm.title_romaji !== found.title_romaji)
			// 			.map((anm) => `[${anm.title_romaji}](https://myanimelist.net/anime/${anm.mal_id})`)
			// 			.join('\n');
			// 		let fileUrl = encodeURI(
			// 			`https://trace.moe/thumbnail.php?anilist_id=${found.anilist_id}&file=${found.filename.replace(/&/g, '%26')}&t=${found.at}&token=${
			// 				found.tokenthumb
			// 			}`
			// 		);
			// 		let video = encodeURI(`https://media.trace.moe/video/${found.anilist_id}/${found.filename}`);
			// 		video = replaceAll(video, { '(': '%28', ')': '%29', '&': '%26' }) + `?t=${found.at}&token=${found.tokenthumb}`;
			// 		let nsfw = found.is_adult ? 'YES 7w7' : 'No 😫';

			// 		let embed = new MessageEmbed()
			// 			.setTitle(util.image.title)
			// 			.setColor('RANDOM')
			// 			.addField('Anime:', `[${found.title_romaji}](https://myanimelist.net/anime/${found.mal_id})`)
			// 			.addField(util.anime.screenshot.at, Time_convertor(found.at * 1000))
			// 			.addField(util.anime.screenshot.similarity, (found.similarity * 100).toFixed(1))
			// 			.addField('Video:', `[Click](${video})`)
			// 			.addField('NSFW', nsfw)
			// 			.addField(util.anime.screenshot.more_results, all || 'No')
			// 			.setImage(fileUrl);

			// 		message.channel.send({ embeds: [embed] });
			// 		msg.delete();
			// 	} catch (err) {
			// 		message.channel.send(err.message);
			// 		console.error(err);
			// 	}

			// 	return;
			default:
				data = await getInfoFromName(anime);
				break;
		}

		if (!data) return message.channel.send(music.not_found);
		let embed = new MessageEmbed()

			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(`${data.score} ⭐`)
			.setThumbnail(data.picture)
			.setColor('RANDOM')

			.addField(util.anime.episodes, data.episodes, true)
			.addField(util.anime.status, data.status, true)
			.addField(util.anime.aired, data.aired, true)
			.addField(util.anime.genre, data.genres.join(', '), true)
			.addField(util.anime.studio, data.studios.join(', '), true)
			.addField(util.anime.source, data.source, true)
			.addField(util.anime.duration, data.duration, true)
			.addField(util.anime.ranking, data.ranked, true)
			.addField(util.anime.popularity, data.popularity, true)

			.setFooter({ text: util.anime.footer });

		message.channel.send({ embeds: [embed] });
	}
};
