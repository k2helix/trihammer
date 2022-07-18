import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'timeout',
	description: 'Timeout a member',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'duration (0 to remove)', type: 'string' },
		{ index: 2, name: 'reason', type: 'string' }
	],
	required_perms: ['ModerateMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['ModerateMembers'],
	async execute(client, message, args, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!,
			time = functions.Convert(args[1]),
			reason = args.slice(2).join(' ') || 'No reason';
		if (!member.moderatable) return message.channel.send({ embeds: [client.redEmbed(mod.not_moderatable)] });
		if (!time) return message.channel.send({ embeds: [client.redEmbed(mod.time_404)] });

		if (args[1].startsWith('0')) {
			member.timeout(null, (reason || 'No reason') + ` | by ${message.author.tag}`);
			return message.channel.send({ embeds: [client.orangeEmbed(mod.timeout.clear.replace('{member}', member.user.tag))] });
		} else if (member.isCommunicationDisabled()) return message.channel.send({ embeds: [client.redEmbed(mod.timeout.already_timed_out)] });

		if (time.tiempo >= 2419200000) return message.channel.send({ embeds: [client.redEmbed(mod.timeout.time)] });

		member.timeout(time.tiempo, (reason || 'No reason') + ` | by ${message.author.tag}`);
		message.channel.send({
			embeds: [
				client.orangeEmbed(
					client.replaceEach(mod.timeout.timeout, {
						'{member}': member.user.tag,
						'{duration}': time.nombre,
						'{reason}': reason || 'No'
					})
				)
			]
		});
	}
});
