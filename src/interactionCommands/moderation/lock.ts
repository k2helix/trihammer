import { ChatInputCommandInteraction, Role, TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'lock',
	description: 'Lock the current channel',
	category: 'moderation',
	required_perms: ['ManageChannels', 'ManageRoles'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	cooldown: 5,
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let role = ((interaction as ChatInputCommandInteraction).options.getRole('role') as Role) || interaction.guild!.roles.cache.find((r) => r.name === '@everyone');

		(interaction.channel as TextChannel).permissionOverwrites.create(
			role!,
			{
				SendMessages: false
			},
			{ reason: `[LOCK] Command used by ${interaction.user.tag}` }
		);
		interaction.reply({ embeds: [client.lightBlueEmbed(mod.channel_lock.replace('{role}', role!.name))] });
	}
});
