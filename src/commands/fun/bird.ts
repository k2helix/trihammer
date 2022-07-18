import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'bird',
	description: 'Bird random image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { body } = await request.get('https://shibe.online/api/birds').query({
			count: '1',
			urls: 'true',
			httpsUrls: 'true'
		});
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as string[])[0])] });
	}
});
