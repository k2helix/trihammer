import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelServer } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'language',
	description: 'Set the server language',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let language = (interaction as ChatInputCommandInteraction).options.getString('language')!;

		const serverConfig = await ModelServer.findOne({ server: interaction.guildId });

		serverConfig.lang = language.toLowerCase();
		serverConfig.save();
		interaction.reply({ embeds: [client.blueEmbed(config.lang_set.replace('{idioma}', language))] });
	}
});
