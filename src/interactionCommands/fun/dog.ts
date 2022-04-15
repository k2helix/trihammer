import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { MessageEmbed } from 'discord.js';
export default new Command({
	name: 'dog',
	description: 'Random dog image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		interaction.reply({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { message: string }).message)] });
	}
});
