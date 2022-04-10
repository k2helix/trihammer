import Command from '../../lib/structures/MessageCommand';

export default new Command({
	name: 'ping',
	description: 'Ping!',
	category: 'utility',
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
});
