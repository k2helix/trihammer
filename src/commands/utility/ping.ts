import { ColorResolvable } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';

export default new MessageCommand({
	name: 'ping',
	description: 'Ping!',
	category: 'utility',
	execute(client, message) {
		message.channel.send('Pinging...').then(async (sent) => {
			let ping = sent.createdTimestamp - message.createdTimestamp;
			let content = `Pong! ${ping}ms`;

			if (message.content.toLowerCase().includes('advanced')) {
				await ModelUsers.findOne({ id: message.author.id });
				content += `\nMongoDB Ping: ${Date.now() - sent.createdTimestamp}ms\nWebsocket: ${client.ws.ping}`;
			}

			const colorsThreshold = [500, 1000, Infinity];
			const colorsObject = {
				[colorsThreshold[0].toString()]: '#0090ff',
				[colorsThreshold[1].toString()]: 'Orange',
				[colorsThreshold[2].toString()]: 'Red'
			};
			const pingColor = colorsObject[colorsThreshold.find((t) => t >= ping)!.toString() as keyof typeof colorsObject];

			sent.edit({ embeds: [client.blackEmbed(content).setColor(pingColor as ColorResolvable)], content: null });
		});
	}
});
