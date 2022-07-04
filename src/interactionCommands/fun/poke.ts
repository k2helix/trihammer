import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'poke',
	description: '<3',
	category: 'fun',
	async execute(client, interaction, guildConf) {
		if (!interaction.isCommand()) return;

		let user = interaction.options.getUser('user') || interaction.user;
		const { kawaii } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get('https://api.nekos.dev/api/v3/images/sfw/gif/poke/');
		let embed = new MessageEmbed();
		embed.setTitle(client.replaceEach(kawaii.poke, { '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('RANDOM');
		embed.setImage((body as { data: { response: { url: string } } }).data.response.url);

		interaction.reply({ embeds: [embed] });
	}
});
