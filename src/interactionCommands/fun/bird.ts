import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'bird',
	description: 'Bird random image',
	category: 'fun',
	required_perms: ['ATTACH_FILES'],
	client_perms: ['ATTACH_FILES'],
	async execute(_client, interaction) {
		const { body } = await request.get('https://shibe.online/api/birds').query({
			count: '1',
			urls: 'true',
			httpsUrls: 'true'
		});
		interaction.reply({ embeds: [new MessageEmbed().setColor('WHITE').setImage((body as string[])[0])] });
	}
});
