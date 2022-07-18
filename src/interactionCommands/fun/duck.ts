import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { EmbedBuilder } from 'discord.js';
export default new Command({
	name: 'duck',
	description: 'Random duck image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		interaction.reply({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { url: string }).url)] });
	}
});
