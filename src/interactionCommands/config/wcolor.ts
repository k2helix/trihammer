import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new Command({
	name: 'wcolor',
	description: 'Set the welcome title color',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let color = (interaction as ChatInputCommandInteraction).options.getString('color')!;
		if (!color.toLowerCase().startsWith('#')) return interaction.reply({ embeds: [client.redEmbed(welcome.hex)] });

		let welcomeModel = await ModelWelc.findOne({ server: interaction.guildId });
		if (!welcome) {
			let newModel = new ModelWelc({
				server: interaction.guildId,
				canal: 'none',
				color: color,
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: `Welcome to ${interaction.guild!.name}`
			});
			welcomeModel = newModel;
		}
		welcomeModel.color = color;
		await welcomeModel.save();
		interaction.reply({ embeds: [client.blueEmbed(welcome.wcolor.replace('{color}', color))] });
	}
});
