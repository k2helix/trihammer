import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';

export default new MessageCommand({
	name: 'panda',
	description: 'Random panda image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, message, args) {
		const { body } = await request.get(args[0] === 'red' ? 'https://some-random-api.ml/img/red_panda' : 'https://some-random-api.ml/img/panda');
		message.channel.send({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { url: string }[])[0].url)] });
	}
});
