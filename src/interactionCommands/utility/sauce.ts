import Command from '../../lib/structures/Command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { Result } from '../../lib/structures/interfaces/SaucenaoInterfaces';
export default new Command({
	name: 'sauce',
	description: 'Get the source of an image',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let image =
			(interaction as CommandInteraction).options.getString('image') ||
			(interaction as CommandInteraction).options.getAttachment('attachment')?.url ||
			((interaction as CommandInteraction).options.getUser('user-avatar') || interaction.user).displayAvatarURL({ format: 'png', size: 1024, dynamic: false })!;

		if (interaction.isContextMenu()) {
			let message = await interaction.channel!.messages.fetch(interaction.options.get('message')!.value as string);
			if (message.embeds[0])
				if (message.embeds[0].type === 'image') image = message.embeds[0].url!;
				else if (message.embeds[0].image) image = message.embeds[0].image.url;
				else if (message.embeds[0].thumbnail) image = message.embeds[0].thumbnail.url;
			let attachments = [...message.attachments.values()];
			if (attachments[0]) image = attachments[0].url;
			if (image === interaction.user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true }))
				return interaction.reply({ embeds: [client.redEmbed(util.anime.screenshot.no_image)], ephemeral: true });
		}
		if (!image!.startsWith('http')) return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });

		let { body } = await request.get(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&numres=1&url=` + image);
		if (!(body as { results: Result[] }).results || (body as { results: Result[] }).results?.length === 0)
			return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });

		let embed = new MessageEmbed()
			.setTitle(util.sauce.title)
			.setDescription(util.sauce.looks_like((body as { results: Result[] }).results[0]))
			.addField(util.sauce.more_source, util.sauce.search_sources(image!))
			.setColor('RANDOM')

			.setImage(image!);
		interaction.reply({ embeds: [embed], ephemeral: interaction.isContextMenu() });
	}
});
