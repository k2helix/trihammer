const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const translate = require('@vitalets/google-translate-api');

function monthandday(ms) {
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
		month = months[date.getMonth()],
		day = date.getDate();

	return `${month}/${day}`;
}
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'today-in-history',
	description: 'Get information about today in history',
	ESdesc: 'Obtén información sobre hoy en la historia',
	usage: 'today-in-history',
	example: 'today-in-history',
	aliases: ['todayinhistory', 'today'],
	type: 0,
	async execute(client, message) {
		const date = monthandday(Date.now());

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		const { text } = await request.get(`http://history.muffinlabs.com/date/${date}`);
		const body = JSON.parse(text);
		const events = body.data.Events;
		const event = events[Math.floor(Math.random() * events.length)];
		let translated = await translate(event.text, { from: 'en', to: langcode });
		const embed = new MessageEmbed()
			.setColor(0x9797ff)
			.setURL(body.url)
			.setTitle(`${util.today.title} (${body.date})...`)
			.setTimestamp()
			.setDescription(`${event.year}: ${translated.text}`)
			.addField(util.today.see_more, event.links.map((link) => `[${link.title}](${link.link})`).join('\n'));
		message.channel.send({ embeds: [embed] });
	}
};
