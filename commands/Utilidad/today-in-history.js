
const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'today-in-history',
	description: 'Get information about today in history',
  aliases: ['todayinhistory', 'history'],
	async execute(client, message, args) {
    const date = client.mothandday(Date.now())
 
    const { text } = await request.get(`http://history.muffinlabs.com/date/${date}`);
			const body = JSON.parse(text);
			const events = body.data.Events;
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new Discord.MessageEmbed()
				.setColor(0x9797FF)
				.setURL(body.url)
				.setTitle(`On this day (${body.date})...`)
				.setTimestamp()
				.setDescription(`${event.year}: ${event.text}`)
				.addField('❯ See More', event.links.map(link => `[${link.title}](${link.link})`).join('\n'));
			 message.channel.send(embed);

	}
};