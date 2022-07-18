import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import translate from '@vitalets/google-translate-api';

function monthandday(ms: number) {
	let date = new Date(ms),
		months = {
			0: '1',
			1: '2',
			2: '3',
			3: '4',
			4: '5',
			5: '6',
			6: '7',
			7: '8',
			8: '9',
			9: '10',
			10: '11',
			11: '12'
		},
		month = months[date.getMonth() as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 0],
		day = date.getDate();

	return `${month}/${day}`;
}
export default new MessageCommand({
	name: 'today-in-history',
	description: 'Get information about today in history',
	aliases: ['todayinhistory', 'today'],
	category: 'information',
	async execute(_client, message, _args, guildConf) {
		const date = monthandday(Date.now());

		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const { text } = await request.get(`http://history.muffinlabs.com/date/${date}`);
		const body = JSON.parse(text!);
		const events = body.data.Events;
		const event = events[Math.floor(Math.random() * events.length)];
		let translated = await translate(event.text, { from: 'en', to: guildConf.lang });
		const embed = new EmbedBuilder()
			.setColor(0x9797ff)
			.setURL(body.url)
			.setTitle(`${util.today.title} (${body.date})...`)
			.setTimestamp()
			.setDescription(`${event.year}: ${translated.text}`)
			.addFields({ name: util.today.see_more, value: event.links.map((link: { title: string; link: string }) => `[${link.title}](${link.link})`).join('\n') });
		message.channel.send({ embeds: [embed] });
	}
});
