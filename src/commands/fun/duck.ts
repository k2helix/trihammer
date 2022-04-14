import request from 'node-superfetch';
import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'duck',
	description: 'Random duck image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, message) {
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		message.channel.send({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { url: string }).url)] });
	}
});
