import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelServer } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'mod-role',
	description: 'Set the moderator role',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		let role = (interaction as ChatInputCommandInteraction).options.getRole('role')!;
		const serverConfig = await ModelServer.findOne({ server: interaction.guildId });
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		serverConfig.modrole = role.id;
		await serverConfig.save();
		interaction.reply({ embeds: [client.blueEmbed(config.role_set.mod.replace('{role}', role!.name))] });
	}
});
