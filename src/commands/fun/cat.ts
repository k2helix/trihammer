import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'cat',
	description: 'Random cat image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { body } = await request.get('https://api.thecatapi.com/v1/images/search'); //https://aws.random.cat/meow
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { url: string }[])[0].url)] });
	}
});
