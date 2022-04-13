import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'koala',
	description: 'Random koala image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, message) {
		const { body } = await request.get('https://some-random-api.ml/img/koala');
		message.channel.send({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { link: string }[])[0].link)] });
	}
});
