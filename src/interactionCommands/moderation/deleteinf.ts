import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'deleteinf',
	description: 'Delete the infraction with the given id',
	category: 'moderation',
	required_roles: ['MODERATOR'],
	required_perms: ['ManageMessages'],
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let key = (interaction as ChatInputCommandInteraction).options.getString('id')!;
		await ModelInfrs.deleteOne({ server: interaction.guildId, key: key });
		interaction.reply({ embeds: [client.blueEmbed(mod.delete_infr.replace('{key}', key))] });
	}
});
