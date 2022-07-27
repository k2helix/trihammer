import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'fox',
	description: 'Random fox image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { body } = await request.get('https://randomfox.ca/floof/');
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { image: string }).image)] });
	}
});
