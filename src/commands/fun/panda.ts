import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'panda',
	description: 'Random panda image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, message, args) {
		const { body } = await request.get(args[0] === 'red' ? 'https://some-random-api.ml/img/red_panda' : 'https://some-random-api.ml/img/panda');
		message.channel.send({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { link: string }).link)] });
	}
});
