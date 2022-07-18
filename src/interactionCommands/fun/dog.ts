import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { EmbedBuilder } from 'discord.js';
export default new Command({
	name: 'dog',
	description: 'Random dog image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		interaction.reply({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { message: string }).message)] });
	}
});
