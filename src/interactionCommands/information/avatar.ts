import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'avatar',
	description: 'Get the avatar of someone',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = (interaction as ChatInputCommandInteraction).options.getUser('user')?.id || interaction.user.id;
		let user = await client.users.fetch(givenId, { force: true }).catch(() => undefined);
		if (!user) return interaction.reply({ embeds: [client.redEmbed(util.invalid_user)], ephemeral: true });

		let avatar = user.displayAvatarURL({ extension: 'png', size: 1024 });
		let info_embed = new EmbedBuilder()
			.setTitle(`${user.tag}`)
			.setColor(user.hexAccentColor || 'Random')
			.setDescription(`[Link](${avatar})`)
			.addFields({ name: util.sauce.more_source, value: util.sauce.search_sources(avatar) })
			.setImage(avatar);
		interaction.reply({ embeds: [info_embed], ephemeral: interaction.isContextMenuCommand() });
	}
});
