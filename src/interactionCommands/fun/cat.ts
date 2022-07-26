import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { EmbedBuilder } from 'discord.js';
export default new Command({
	name: 'cat',
	description: 'Random cat image',
	category: 'fun',
	required_perms: ['AttachFiles'],
	client_perms: ['AttachFiles'],
	async execute(_client, interaction) {
		const { body } = await request.get({ url: 'https://api.thecatapi.com/v1/images/search' }); //https://aws.random.cat/meow
		interaction.reply({ embeds: [new EmbedBuilder().setColor('White').setImage((body as { url: string }[])[0].url)] });
	}
});
