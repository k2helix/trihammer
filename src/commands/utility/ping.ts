import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
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
			sent.edit({ embeds: [client.blackEmbed(content)], content: null });
		});
	}
});
