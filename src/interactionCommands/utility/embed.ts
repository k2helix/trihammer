import Command from '../../lib/structures/Command';
import { ColorResolvable, MessageEmbed } from 'discord.js';
export default new Command({
	name: 'embed',
	description: 'Make an [embed](https://phodit.net/embedbuilder/)',
	category: 'utility',
	required_roles: ['MODERATOR'],
	required_perms: ['MANAGE_WEBHOOKS'],
	execute(_client, interaction) {
		if (!interaction.inCachedGuild() || !interaction.isCommand()) return;
		interaction.reply({ content: ':thumbsup:', ephemeral: true });

		if (interaction.options.getString('json')) return interaction.channel!.send({ embeds: [new MessageEmbed(JSON.parse(interaction.options.getString('json')!))] });
		let embed = new MessageEmbed();

		if (interaction.options.getString('title')) embed.setTitle(interaction.options.getString('title')!);
		if (interaction.options.getString('description')) embed.setDescription(interaction.options.getString('description')!);
		if (interaction.options.getString('footer')) embed.setFooter({ text: interaction.options.getString('footer')! });
		if (interaction.options.getString('thumbnail')) embed.setThumbnail(interaction.options.getString('thumbnail')!);
		if (interaction.options.getString('image')) embed.setImage(interaction.options.getString('image')!);
		if (interaction.options.getString('color')) embed.setColor(interaction.options.getString('color') as ColorResolvable);

		if (interaction.options.getString('field-title-1'))
			embed.addField(interaction.options.getString('field-title-1')!, interaction.options.getString('field-content-1') || '** **');
		if (interaction.options.getString('field-title-2'))
			embed.addField(interaction.options.getString('field-title-2')!, interaction.options.getString('field-content-2') || '** **');
		if (interaction.options.getString('field-title-3'))
			embed.addField(interaction.options.getString('field-title-3')!, interaction.options.getString('field-content-3') || '** **');

		interaction.channel!.send({ embeds: [embed] });
	}
});
