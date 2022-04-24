import { TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'lock',
	description: 'Lock the current channel',
	category: 'moderation',
	required_args: [{ index: 0, name: 'role', type: 'role', optional: true }],
	required_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	cooldown: 5,
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let role = message.mentions.roles.first() || message.guild!.roles.cache.get(args[0]) || message.guild!.roles.cache.find((r) => r.name === '@everyone');

		(message.channel as TextChannel).permissionOverwrites.create(
			role!,
			{
				SEND_MESSAGES: false
			},
			{ reason: `[LOCK] Command used by ${message.author.tag}` }
		);
		message.channel.send({ embeds: [client.lightBlueEmbed(mod.channel_lock.replace('{role}', role!.name))] });
	}
});
