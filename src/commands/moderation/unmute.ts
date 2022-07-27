import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'unmute',
	description: 'Unmute a user',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'reason', type: 'string', optional: true }
	],
	required_perms: ['ManageMessages'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	aliases: ['desmute'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		if (!member.manageable) return message.channel.send({ embeds: [client.redEmbed(mod.not_moderatable)] });

		let reason = args.slice(1).join(' ') || 'No';

		let mutedRole = message.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
		if (!mutedRole) return message.channel.send({ embeds: [client.redEmbed(mod.no_muted_role)] });

		if (!member.roles.cache.has(mutedRole.id))
			return message.channel.send({ embeds: [client.redEmbed(client.replaceEach(mod.has_role_nt, { '{member}': `<@${member.id}>`, '{role}': 'Trimuted' }))] });

		member.roles.remove(mutedRole, `[UNMUTE] Command used by ${message.author.tag} | Reason: ${reason}`);
		message.channel.send({
			embeds: [client.orangeEmbed(client.replaceEach(mod.infraction, { '{user}': member.user.tag, '{action}': mod.actions['unmuted'], '{reason}': reason }))]
		});

		client.emit('infractionCreate', {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔊 UNMUTE',
			time: 'N/A',
			mod: message.author.tag,
			reason: reason,
			guild: message.guildId
		});
	}
});
