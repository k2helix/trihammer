import { TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'unlock',
	description: 'Unlock the current channel',
	category: 'moderation',
	required_args: [{ index: 0, name: 'role', type: 'role', optional: true }],
	required_perms: ['ManageChannels', 'ManageRoles'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	cooldown: 5,
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let role = message.mentions.roles.first() || message.guild!.roles.cache.get(args[0]) || message.guild!.roles.cache.find((r) => r.name === '@everyone');

		(message.channel as TextChannel).permissionOverwrites.create(
			role!,
			{
				SendMessages: null
			},
			{ reason: `[UNLOCK] Command used by ${message.author.tag}` }
		);
		message.channel.send({ embeds: [client.lightBlueEmbed(mod.channel_unlock.replace('{role}', role!.name))] });
	}
});
