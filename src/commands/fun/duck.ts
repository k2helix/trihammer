import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'duck',
	description: 'Random duck image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { url: string }).url)] });
	}
});
