import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'dog',
	description: 'Random dog image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { message: string }).message)] });
	}
});
