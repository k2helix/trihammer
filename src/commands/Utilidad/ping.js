const { MessageEmbed } = require('discord.js');
let { ModelUsers } = require('../../utils/models');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	ESdesc: 'Ping!',
	usage: 'Ping!',
	example: 'Ping!',
	type: 0,
	execute(client, message) {
		message.channel.send('Pinging...').then(async (sent) => {
			let embed = null;
			if (message.content.toLowerCase().includes('advanced')) {
				await ModelUsers.findOne({ id: message.author.id });
				embed = new MessageEmbed()
					.setColor('RANDOM')
					.addField('MongoDB Ping', Date.now() - sent.createdTimestamp + 'ms')
					.addField('Websocket', client.ws.ping + 'ms');
			}
			sent.edit(`Pong! ${sent.createdTimestamp - message.createdTimestamp}ms`, embed);
		});
	}
};
