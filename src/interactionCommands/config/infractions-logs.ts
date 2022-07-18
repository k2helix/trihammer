import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelServer } from '../../lib/utils/models';
import { ChatInputCommandInteraction, GuildBasedChannel } from 'discord.js';
export default new Command({
	name: 'infractions-logs',
	description: 'Set the infractions logs channel',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let channel = (interaction as ChatInputCommandInteraction).options.getChannel('channel') as GuildBasedChannel;
		if (!channel.isTextBased()) return interaction.reply({ embeds: [client.redEmbed(config.only_text)], ephemeral: true });
		const serverConfig = await ModelServer.findOne({ server: interaction.guildId });

		serverConfig.infrlogs = channel.id;
		await serverConfig.save();
		interaction.reply({ embeds: [client.blueEmbed(config.channel_set.infractions.replace('{channel}', `<#${channel.id}>`))] });
	}
});
