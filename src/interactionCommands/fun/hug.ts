import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'hug',
	description: '<3',
	category: 'fun',
	async execute(client, interaction, guildConf) {
		if (!interaction.isChatInputCommand()) return;

		let user = interaction.options.getUser('user') || interaction.user;
		const { kawaii } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get('https://nekos.life/api/v2/img/hug');
		let embed = new EmbedBuilder();
		embed.setTitle(client.replaceEach(kawaii.hug, { '{author}': interaction.user.username, '{member}': user.username }));
		embed.setColor('Random');
		embed.setImage((body as { url: string }).url);

		interaction.reply({ embeds: [embed] });
	}
});
