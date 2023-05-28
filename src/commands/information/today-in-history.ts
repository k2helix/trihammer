import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import translate, { googleTranslateApi } from 'google-translate-api-x';

function monthandday(ms: number) {
	let date = new Date(ms);
	return `${date.getMonth() + 1}/${date.getDate()}`;
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
		let translated = (await translate(event.text, { from: 'en', to: guildConf.lang })) as googleTranslateApi.TranslationResponse;
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
