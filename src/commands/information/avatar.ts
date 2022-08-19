import MessageCommand from '../../lib/structures/MessageCommand';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, MessageOptions } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'avatar',
	description: 'Get the avatar of someone',
	aliases: ['icon', 'pfp'],
	category: 'information',
	required_args: [{ index: 0, name: 'user', type: 'user', optional: true }],
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = message.mentions.users.first()?.id || args[0] || message.author.id;
		let user = await client.users.fetch(givenId, { force: true }).catch(() => undefined);
		if (!user) return;

		let member = await message.guild!.members.fetch(givenId).catch(() => undefined);
		let avatar = user.displayAvatarURL({ extension: 'png', size: 1024 });
		let info_embed = new EmbedBuilder()
			.setTitle(`${user.tag}`)
			.setColor(user.hexAccentColor || 'Random')
			.setDescription(`[Link](${avatar})`)
			.addFields({ name: util.sauce.more_source, value: util.sauce.search_sources(avatar) })
			.setImage(avatar);

		let info: MessageOptions = { embeds: [info_embed] };
		let row: ActionRowBuilder<ButtonBuilder>;
		if (member?.avatar) {
			row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId('serverAvatar').setLabel(util.user.server_avatar).setStyle(ButtonStyle.Primary)
			);
			info.components = [row];
		}
		let msg = await message.channel.send(info);
		if (info.components) {
			const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
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
				msg.edit({ components: [] }).catch(() => null);
			});
		}
	}
});
