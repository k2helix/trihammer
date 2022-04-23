import { User } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'forceban',
	description: 'Ban an user which is not in the server',
	aliases: ['hackban'],
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'string' },
		{ index: 1, name: 'reason', type: 'string' }
	],
	required_perms: ['BAN_MEMBERS'],
	required_roles: ['MODERATOR'],
	client_perms: ['BAN_MEMBERS'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let id = args[0];
		let reason = args.slice(1).join(' ') || 'No';

		message
			.guild!.members.ban(id, { reason: `[FORCEBAN] Command used by ${message.author.tag} | Reason: ${reason}` })
			.then(async (user) => {
				message.channel.send({
					embeds: [client.blueEmbed(client.replaceEach(mod.infraction, { '{user}': (user as User).tag, '{action}': mod.actions['banned'], '{reason}': reason }))]
				});

				let infrs = await ModelInfrs.find().lean();
				let key = infrs.length;
				let newModel = new ModelInfrs({
					key: key,
					id: (user as User).id,
					server: message.guildId!,
					duration: 'N/A',
					tipo: 'ban',
					time: `${message.createdTimestamp}`,
					mod: message.author.id,
					reason: reason
				});
				await newModel.save();

				client.emit('infractionCreate', {
					user: {
						id: (user as User).id,
						tag: (user as User).tag
					},
					type: '🔨 FORCEBAN',
					time: 'N/A',
					mod: message.author.tag,
					reason: reason,
					guild: message.guildId
				});
			})
			.catch((error) => {
				console.error(error);
				message.channel.send({ embeds: [client.redEmbed(mod.user_404.replace('{id}', id))] });
			});
	}
});
