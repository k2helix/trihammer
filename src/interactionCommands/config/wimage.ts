import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new Command({
	name: 'wimage',
	description: 'Set the welcome background image',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let image =
			(interaction as ChatInputCommandInteraction).options.getString('image') || (interaction as ChatInputCommandInteraction).options.getAttachment('attachment')?.url;
		if (!image?.toLowerCase().startsWith('http') || image?.includes('cdn.discordapp.com') || image?.includes('media.discordapp.net'))
			return interaction.reply({ embeds: [client.redEmbed(welcome.need_url)] });

		let welcomeModel = await ModelWelc.findOne({ server: interaction.guildId });
		if (!welcomeModel) {
			let newModel = new ModelWelc({
				server: interaction.guildId,
				canal: 'none',
				color: '#ffffff',
				image: image,
				text: `Welcome to ${interaction.guild!.name}`
			});
			welcomeModel = newModel;
		}
		welcomeModel.image = image;
		await welcomeModel.save();
		interaction.reply({ embeds: [client.blueEmbed(welcome.wimage)] });
	}
});
