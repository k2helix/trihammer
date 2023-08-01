import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionReplyOptions
} from 'discord.js';
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

		let member = await interaction.guild!.members.fetch(givenId).catch(() => undefined);
		let avatar = user.displayAvatarURL({ extension: 'png', size: 1024 });
		let info_embed = new EmbedBuilder()
			.setTitle(`${user.displayName}`)
			.setColor(user.hexAccentColor || 'Random')
			.setDescription(`[Link](${avatar})`)
			.addFields({ name: util.sauce.more_source, value: util.sauce.search_sources(avatar) })
			.setImage(avatar);

		let info: InteractionReplyOptions = { embeds: [info_embed], ephemeral: interaction.isContextMenuCommand() };
		let row: ActionRowBuilder<ButtonBuilder>;
		if (member?.avatar) {
			row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId('serverAvatar').setLabel(util.user.server_avatar).setStyle(ButtonStyle.Primary)
			);
			info.components = [row];
		}

		interaction.reply(info);

		if (info.components) {
			let msg = await interaction.fetchReply();
			const filter = (int: ButtonInteraction) => int.user.id === interaction.user.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 60000, componentType: ComponentType.Button });
			collector.on('collect', (reaction) => {
				let button = ButtonBuilder.from(reaction.component);
				if (button.data.label === util.user.server_avatar)
					reaction.update({
						embeds: [EmbedBuilder.from(msg.embeds[0]).setImage(member!.displayAvatarURL({ extension: 'png', size: 1024 }))],
						components: [row.setComponents(button.setLabel(util.user.user_avatar))]
					});
				else
					reaction.update({
						embeds: [EmbedBuilder.from(msg.embeds[0]).setImage(avatar)],
						components: [row.setComponents(button.setLabel(util.user.server_avatar))]
					});
			});
			collector.on('end', () => {
				if (!interaction.isContextMenuCommand()) msg.edit({ components: [] }).catch(() => null);
			});
		}
	}
});
