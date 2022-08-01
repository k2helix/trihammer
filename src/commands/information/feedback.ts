import MessageCommand from '../../lib/structures/MessageCommand';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'feedback',
	description: 'Send some feedback about the bot to the developer',
	category: 'information',
	async execute(client, message, _args, guildConf) {
		if (client.user!.id !== '714489403627536415') return;
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId('sendFeedback').setLabel(util.feedback.send_feedback).setStyle(ButtonStyle.Primary)
		);
		let msg = await message.channel.send({ embeds: [client.lightBlueEmbed(util.feedback.main)], components: [row] });

		const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
		try {
			let pressed = await msg.awaitMessageComponent({ filter, time: 20000, componentType: ComponentType.Button });
			if (pressed.customId === 'sendFeedback') {
				const modal = new ModalBuilder().setCustomId('feedback').setTitle('Feedback');
				const titleInput = new TextInputBuilder()
					.setCustomId('feedbackTitle')
					.setLabel(util.feedback.title)
					.setStyle(TextInputStyle.Short)
					.setRequired(false)
					.setMaxLength(256);
				const feedbackInput = new TextInputBuilder().setCustomId('feedbackComment').setLabel(util.feedback.comment).setStyle(TextInputStyle.Paragraph).setMaxLength(4000);

				const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
				const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(feedbackInput);
				modal.addComponents(firstActionRow, secondActionRow);

				await pressed.showModal(modal);
			}
		} catch (error) {
			return msg.delete();
		}
	}
});
