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
			.setTitle(client.user!.username)
			.setDescription(
				client.replaceEach(util.about, {
					'{username}': client.user!.username,
					'{invite_link}': `https://discord.com/oauth2/authorize?client_id=${client.user!.id}&permissions=8&scope=bot%20applications.commands`,
					'{invite_link_np}': `https://discord.com/oauth2/authorize?client_id=${client.user!.id}&permissions=0&scope=bot%20applications.commands`,
					'{guilds}': client.guilds.cache.size.toString(),
					'{members}': client.users.cache.size.toString()
				})
			)
			.setThumbnail(client.user!.displayAvatarURL())
			.setTimestamp()
			.setColor(5814783);
		interaction.reply({ embeds: [embed] });
	}
});
