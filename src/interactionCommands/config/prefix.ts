import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelServer } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'prefix',
	description: 'Set the server prefix',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		let prefix = (interaction as ChatInputCommandInteraction).options.getString('prefix')!;
		if (prefix.length > 10) return interaction.reply('No.');

		const serverConfig = await ModelServer.findOne({ server: interaction.guildId });
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		serverConfig.prefix = prefix;
		serverConfig.save();
		interaction.reply({ embeds: [client.blueEmbed(config.prefix_set.replace('{prefix}', prefix))] });
	}
});
