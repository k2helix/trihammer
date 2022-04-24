import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'unmute',
	description: 'Unmute a user',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'user' },
		{ index: 1, name: 'reason', type: 'string', optional: true }
	],
	required_perms: ['MANAGE_MESSAGES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	aliases: ['desmute'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		let reason = args.slice(1).join(' ') || 'No';

		member.roles.remove(message.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted')!, `[UNMUTE] Command used by ${message.author.tag} | Reason: ${reason}`);
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
