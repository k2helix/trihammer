import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import { MessageEmbed } from 'discord.js';
export default new Command({
	name: 'cat',
	description: 'Random cat image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://api.thecatapi.com/v1/images/search'); //https://aws.random.cat/meow
		interaction.reply({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as { url: string }[])[0].url)] });
	}
});
