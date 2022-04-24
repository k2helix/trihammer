import { CommandInteraction, Role, TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'unlock',
	description: 'Unlock the current channel',
	category: 'moderation',
	required_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	cooldown: 5,
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let role = ((interaction as CommandInteraction).options.getRole('role') as Role) || interaction.guild!.roles.cache.find((r) => r.name === '@everyone');

		(interaction.channel as TextChannel).permissionOverwrites.create(
			role!,
			{
				SEND_MESSAGES: null
			},
			{ reason: `[UNLOCK] Command used by ${interaction.user.tag}` }
		);
		interaction.reply({ embeds: [client.lightBlueEmbed(mod.channel_unlock.replace('{role}', role!.name))] });
	}
});
