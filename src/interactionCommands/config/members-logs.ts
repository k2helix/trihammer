import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelServer } from '../../lib/utils/models';
import { CommandInteraction, GuildBasedChannel } from 'discord.js';
export default new Command({
	name: 'members-logs',
	description: 'Set the members logs channel',
	category: 'configuration',
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let channel = (interaction as CommandInteraction).options.getChannel('channel') as GuildBasedChannel;
		if (!channel.isText()) return interaction.reply({ embeds: [client.redEmbed(config.only_text)], ephemeral: true });
		const serverConfig = await ModelServer.findOne({ server: interaction.guildId });

		serverConfig.memberlogs = channel.id;
		await serverConfig.save();
		interaction.reply({ embeds: [client.blueEmbed(config.channel_set.members.replace('{channel}', `<#${channel.id}>`))] });
	}
});
