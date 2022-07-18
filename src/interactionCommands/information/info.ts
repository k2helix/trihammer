import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'info',
	description: 'Get info about a user',
	category: 'information',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = (interaction as ChatInputCommandInteraction).options.getUser('user')?.id || interaction.user.id;
		let user = await client.users.fetch(givenId, { force: true }).catch(() => undefined);
		if (!user) return interaction.reply({ embeds: [client.redEmbed(util.invalid_user)], ephemeral: true });

		let member = await interaction.guild!.members.fetch(givenId).catch(() => undefined);
		let avatar = user.displayAvatarURL({ extension: 'png', size: 1024 });
		let info_embed = new EmbedBuilder()
			.setAuthor({ name: user.tag, iconURL: avatar })
			.setColor(user.hexAccentColor || 'Random')
			.setThumbnail(avatar)
			.setDescription(`<@${user.id}>`)

			.addFields({ name: util.user.information, value: util.user.main_info(user), inline: false })
			.setImage(user.bannerURL({ size: 1024 })!);
		if (member) info_embed.addFields({ name: util.user.server, value: util.user.server_specific(member) });

		interaction.reply({ embeds: [info_embed], ephemeral: interaction.isContextMenuCommand() });
	}
});
