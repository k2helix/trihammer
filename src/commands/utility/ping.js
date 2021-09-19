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
			let content = `Pong! ${sent.createdTimestamp - message.createdTimestamp}ms`;
			if (message.content.toLowerCase().includes('advanced')) {
				await ModelUsers.findOne({ id: message.author.id });
				content += `\nMongoDB Ping: ${Date.now() - sent.createdTimestamp}ms\nWebsocket: ${client.ws.ping}`;
			}
			sent.edit(content);
		});
	}
};
