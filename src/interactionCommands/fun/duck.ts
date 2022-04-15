import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { MessageEmbed } from 'discord.js';
export default new Command({
	name: 'duck',
	description: 'Random duck image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		interaction.reply({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { url: string }).url)] });
	}
});
