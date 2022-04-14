import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'dog',
	description: 'Random dog image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, message) {
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		message.channel.send({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { message: string }).message)] });
	}
});
