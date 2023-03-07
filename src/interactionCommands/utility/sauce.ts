import Command from '../../lib/structures/Command';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { Result } from '../../lib/structures/interfaces/SaucenaoInterfaces';
export default new Command({
	name: 'sauce',
	description: 'Get the source of an image',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		if (!process.env.SAUCENAO_API_KEY) return;
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let image =
			(interaction as ChatInputCommandInteraction).options.getString('image') ||
			(interaction as ChatInputCommandInteraction).options.getAttachment('attachment')?.url ||
			((interaction as ChatInputCommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })!;

		if (interaction.isContextMenuCommand()) {
			let message = await interaction.channel!.messages.fetch(interaction.options.get('message')!.value as string);
			if (message.embeds[0])
				if (message.embeds[0].image) image = message.embeds[0].image.url;
				else if (message.embeds[0].thumbnail) image = message.embeds[0].thumbnail.url;
			let attachments = [...message.attachments.values()];
			if (attachments[0]) image = attachments[0].url;
			if (image === interaction.user.displayAvatarURL({ extension: 'png', size: 1024 }))
				return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });
		}
		if (!image!.startsWith('http')) return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });

		let { body } = await request.get(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&numres=1&url=` + image);
		if (!(body as { results: Result[] }).results || (body as { results: Result[] }).results?.length === 0)
			return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });

		let embed = new EmbedBuilder()
			.setTitle(util.sauce.title)
			.setDescription(util.sauce.looks_like((body as { results: Result[] }).results[0]))
			.addFields({ name: util.sauce.more_source, value: util.sauce.search_sources(image!) })
			.setColor('Random')

			.setImage(image!);
		interaction.reply({ embeds: [embed], ephemeral: interaction.isContextMenuCommand() });
	}
});
