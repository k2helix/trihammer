import Command from '../../lib/structures/Command';
import request from 'node-superfetch';
import { EmbedBuilder } from 'discord.js';
export default new Command({
	name: 'koala',
	description: 'Random koala image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://some-random-api.ml/img/koala');
		interaction.reply({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { link: string }).link)] });
	}
});
