import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new Command({
	name: 'wimage',
	description: 'Set the welcome background image',
	category: 'configuration',
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let image = (interaction as CommandInteraction).options.getString('image') || (interaction as CommandInteraction).options.getAttachment('attachment')?.url;
		if (!image?.toLowerCase().startsWith('http')) return interaction.reply({ embeds: [client.redEmbed(welcome.need_url)] });

		let welcomeModel = await ModelWelc.findOne({ server: interaction.guildId });
		if (!welcome) {
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
