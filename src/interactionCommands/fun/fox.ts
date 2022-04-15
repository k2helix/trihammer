import Command from '../../lib/structures/Command';
import request from 'node-superfetch';
import { MessageEmbed } from 'discord.js';
export default new Command({
	name: 'fox',
	description: 'Random fox image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://randomfox.ca/floof/');
		interaction.reply({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { image: string }).image)] });
	}
});
