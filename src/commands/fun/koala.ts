import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'koala',
	description: 'Random koala image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message) {
		const { text } = await request.get('https://some-random-api.ml/img/koala');
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage(JSON.parse(text!).link)] });
	}
});
