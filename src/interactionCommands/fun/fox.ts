import Command from '../../lib/structures/Command';
import request from 'node-superfetch';
import { EmbedBuilder } from 'discord.js';
export default new Command({
	name: 'fox',
	description: 'Random fox image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, interaction) {
		const { body } = await request.get({ url: 'https://randomfox.ca/floof/' });
		interaction.reply({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { image: string }).image)] });
	}
});
