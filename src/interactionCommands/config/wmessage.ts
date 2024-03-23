import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new Command({
	name: 'wmessage',
	description: 'Set the welcome message',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let msg = (interaction as ChatInputCommandInteraction).options.getString('message')!;

		let welcomeModel = await ModelWelc.findOne({ server: interaction.guildId });
		if (!welcomeModel) {
			let newModel = new ModelWelc({
				server: interaction.guildId,
				canal: 'none',
				color: '#ffffff',
				image: 'assets/default-background.png',
				text: msg
			});
			welcomeModel = newModel;
		}
		welcomeModel.text = msg;
		await welcomeModel.save();
		interaction.reply({ embeds: [client.blueEmbed(welcome.wmessage)] });
	}
});
