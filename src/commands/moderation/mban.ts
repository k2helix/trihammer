import { User } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'mban',
	description: 'Ban multiple users in one command',
	cooldown: 5,
	aliases: ['multiban'],
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'users', type: 'string' },
		{ index: 1, name: '-r reason', type: 'string' }
	],
	required_perms: ['BAN_MEMBERS'],
	required_roles: ['MODERATOR'],
	client_perms: ['BAN_MEMBERS'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let r = args.indexOf('-r');
		let reason = args.slice(r + 1).join(' ');
		let ctt = 0;
		if (r == -1) return message.channel.send('mban <users> -r <reason>');
		args.slice(0, r).forEach((id) => {
			message
				.guild!.members.ban(id, { reason: `[MBAN] Command used by ${message.author.tag} | Reason: ${reason}` })
				.then(async (user) => {
					let infrs = await ModelInfrs.find().lean();
					let key = infrs.length;
					let newModel = new ModelInfrs({
						key: key,
						id: (user as User).id,
						server: message.guildId,
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
				.catch(() => {
					return message.channel.send(mod.user_404.replace('{id}', id));
				});
			++ctt;
		});
		message.channel.send({ embeds: [client.orangeEmbed(mod.mban.replace('{count}', ctt.toString()))] });
	}
});
