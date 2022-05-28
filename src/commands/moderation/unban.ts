import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'unban',
	description: 'Unban a banned user',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'string' },
		{ index: 1, name: 'reason', type: 'string', optional: true }
	],
	required_perms: ['BAN_MEMBERS'],
	required_roles: ['MODERATOR'],
	client_perms: ['BAN_MEMBERS'],
	aliases: ['desban'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let id = args[0];
		let reason = args.slice(1).join(' ') || 'No';

		message
			.guild!.members.unban(id, `[UNBAN] Command used by ${message.author.tag} | Reason: ${reason}`)
			.then((user) => {
				message.channel.send({
					embeds: [client.orangeEmbed(client.replaceEach(mod.infraction, { '{user}': user!.tag, '{action}': mod.actions['unbanned'], '{reason}': reason }))]
				});

				client.emit('infractionCreate', {
					user: {
						id: user!.id,
						tag: user!.tag
					},
					type: '🔧 UNBAN',
					time: 'N/A',
					mod: message.author.tag,
					reason: reason,
					guild: message.guildId
				});
			})
			.catch(() => {
				return message.channel.send({ embeds: [client.redEmbed(mod.user_404.replace('{id}', id))] });
			});
	}
});
