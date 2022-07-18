import request from 'node-superfetch';
import cheerio, { CheerioAPI } from 'cheerio';
import { matchSorter } from 'match-sorter';
//editado de mal-scraper
const getFromBorder = ($: CheerioAPI, t: string) => {
	return $(`span:contains("${t}")`).parent().text().trim().split(' ').slice(1).join(' ').split('\n')[0].trim();
};

interface manga {
	title: string;
	picture: string;
	type: string;
	volumes: string;
	status: string;
	published: string;
	authors: string;
	chapters: string;
	genres: string[];
	score: string;
	ranked: string;
	popularity: string;
	id: number;
	url: string;
}

const parsePage = (data: Buffer) => {
	const $ = cheerio.load(data);
	const result: manga = {
		title: '',
		picture: '',
		type: '',
		volumes: '',
		status: '',
		genres: [],
		score: '',
		ranked: '',
		popularity: '',
		id: 0,
		url: '',
		published: '',
		authors: '',
		chapters: ''
	};

	// We have to do this because MAL sometimes set the english title just below the japanese one
	// Example:
	//    - with: https://myanimelist.net/anime/30654/Ansatsu_Kyoushitsu_2nd_Season
	//    - without: https://myanimelist.net/anime/20047/Sakura_Trick
	$('span[itemprop="name"] br').remove();
	$('span[itemprop="name"] span').remove();

	result.title = $('span[itemprop="name"]').first().text();
	result.picture = $(`img[itemprop="image"][alt="${result.title}"]`).attr('data-src')!;

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
async function getInfoFromURL(url: string) {
	if (!url || typeof url !== 'string' || !url.toLocaleLowerCase().includes('myanimelist')) return;

	url = encodeURI(url);

	let { body } = await request.get(url);
	const res = parsePage(body as Buffer);
	res.id = +url.split(/\/+/)[3];
	res.url = url;
	return res;
}

interface Payload {
	media_type?: string;
	start_year?: number;
	aired?: string;
	score?: string;
	status?: string;
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
	let { body } = await request.get('https://myanimelist.net/search/prefix.json?type=manga&keyword=' + keyword);
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
		const bestMacth = getBestMatch ? matchSorter(items, name, { keys: ['name'] })[0] : items[0];
		const url = bestMacth ? bestMacth.url : items[0].url;
		const data = await getInfoFromURL(url);

		data!.url = url;

		return data;
	} catch (e) {
		/* istanbul ignore next */
		console.error(e);
	}
}
import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'manga',
	description: 'Search for a manga in myanimelist',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		interaction.deferReply();
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let manga = (interaction as ChatInputCommandInteraction).options.getString('query')!;
		let data;
		if ((interaction as ChatInputCommandInteraction).options.getBoolean('confirm-result')) {
			let results = await getResultsFromSearch(manga);
			if (!results) return;

			let options = [];
			for (let index = 0; index < results.length; index++) {
				const element = results[index];
				options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
			}
			const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new SelectMenuBuilder().setCustomId('manga').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
			);

			let searchEmbed = new EmbedBuilder()
				.setTitle(util.image.title)
				.setColor('Random')
				.setDescription(`${results.map((result) => `**${results!.indexOf(result) + 1} -** [${result.name}](${result.url})`).join('\n')}\n ${util.anime.type_a_number}`);
			let msg = await interaction.channel!.send({ embeds: [searchEmbed], components: [row] });
			const filter = (int: SelectMenuInteraction) => int.customId === 'manga' && int.user.id === interaction.user.id;
			try {
				let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
				data = await getInfoFromURL(`https://myanimelist.net/manga/${selected.values[0]}`);
				msg.delete();
			} catch (error) {
				if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel });
				else interaction.reply({ content: music.cancel, ephemeral: true });
				return msg.delete();
			}
		} else data = await getInfoFromName(manga);

		if (!data) return interaction.editReply({ embeds: [client.redEmbed(music.not_found)] });
		let embed = new EmbedBuilder()
			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(`${data.score} ⭐`)
			.setThumbnail(data.picture)
			.setColor('Random')
			.addFields(
				{ name: util.manga.type, value: data.type, inline: true },
				{ name: util.manga.volumes, value: data.volumes, inline: true },
				{ name: util.manga.chapters, value: data.chapters, inline: true },
				{ name: util.manga.author, value: data.authors, inline: true },
				{ name: util.manga.published, value: data.published, inline: true },
				{ name: util.manga.genre, value: data.genres.join(', ') || 'No', inline: true },
				{ name: util.manga.status, value: data.status, inline: true },
				{ name: util.manga.ranking, value: data.ranked, inline: true },
				{ name: util.manga.popularity, value: data.popularity, inline: true }
			);

		interaction.editReply({ embeds: [embed] });
	}
});
