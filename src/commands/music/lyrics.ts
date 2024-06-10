import { queue } from '../../lib/modules/music';
import { load } from 'cheerio';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

async function getSongLyrics(song: string) {
	const url = `https://www.google.com/search?q=${song} song lyrics`;
	try {
		let { text } = await request.get({
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:98.0) Gecko/20100101 Firefox/98.0',
				'Content-Type': 'application/json'
			}
		});
		if (!text) return '';
		let lyrics: string[] = [];
		let $ = load(text);
		let mainDiv = $('div[jsname="WbKHeb"]')[0].children;
		mainDiv.forEach((div) => {
			// @ts-ignore
			let spanChildren = div.children.filter((ch) => ch.name === 'span');
			// @ts-ignore
			let spanLyrics = spanChildren.map((sp) => sp.children[0].data).join('\n');
			lyrics.push(spanLyrics);
		});
		return lyrics.join('\n\n');
	} catch (err) {
		return '';
	}
}

export default new MessageCommand({
	name: 'lyrics',
	description: 'Get the lyrics of a song',
	required_args: [{ index: 0, type: 'string', name: 'song', optional: true }],
	aliases: ['letra', 'lyr'],
	category: 'music',
	cooldown: 10,
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let song = args.join(' ') || queue.get(message.guildId!)?.songs[0].title;
		if (!song) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		let lyrics;
		if (queue.get(message.guildId!)?.songs[0].channel.url == 'https://suno.com/') {
			const id = queue.get(message.guildId!)?.songs[0].title.replace('.mp3', '');
			const { body } = await request.get('http://localhost:3000/api/get?ids=' + id, {
				headers: {
					accept: 'application/json'
				}
			});

			//@ts-ignore
			lyrics = body[0].lyric;
		} else lyrics = await getSongLyrics(song);

		if (!lyrics) return message.channel.send({ embeds: [client.redEmbed(music.lyrics_not_found)] });

		message.channel.send({ embeds: [client.blueEmbed(lyrics.length > 4096 ? `${lyrics.slice(0, 4080)}\n...` : lyrics)] });
	}
});
