import Command from '../../lib/structures/Command';
import { EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'bot-info',
	description: 'Bot info',
	category: 'information',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let embed = new EmbedBuilder()
			.setTitle('Trihammer')
			.setDescription(client.replaceEach(util.about, { '{guilds}': client.guilds.cache.size.toString(), '{members}': client.users.cache.size.toString() }))
			.setThumbnail(client.user!.displayAvatarURL())
			.setTimestamp()
			.setColor(5814783);
		interaction.reply({ embeds: [embed] });
	}
});
