import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'mkick',
	description: 'Kick multiple users in one command',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'users', type: 'string' },
		{ index: 1, name: '-r reason', type: 'string' }
	],
	required_perms: ['KickMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['KickMembers'],
	aliases: ['multikick'],
	cooldown: 5,
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let r = args.indexOf('-r');
		let reason = args.slice(r + 1).join(' ');
		if (r == -1) return message.channel.send('mkick <users> -r <reason> [-nodm]');

		let ctt = 0;
		args.slice(0, r).forEach(async (id) => {
			let member = message.guild!.members.cache.get(id)!;
			let sendDM = !message.content.toLowerCase().includes('-nodm');

			try {
				switch (sendDM) {
					case true:
						member
							.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['kicked'], '{server}': message.guild!.name, '{reason}': reason }))
							.catch(() => undefined);
						break;

					case false:
						reason = reason.slice(0, reason.indexOf('-nodm'));
						break;
				}

				member.kick(`[MKICK] Command used by ${message.author.tag} | Reason: ${reason}`);

				let infrs = await ModelInfrs.find().lean();
				let key = infrs.length;
				let newModel = new ModelInfrs({
					key: key,
					id: member.id,
					server: message.guildId,
					duration: 'N/A',
					tipo: 'kick',
					time: `${message.createdTimestamp}`,
					mod: message.author.id,
					reason: reason
				});
				await newModel.save();

				client.emit('infractionCreate', {
					user: {
						id: member.id,
						tag: member.user.tag
					},
					type: '👢 KICK',
					time: 'N/A',
					mod: message.author.tag,
					reason: reason,
					guild: message.guildId
				});
			} catch (err) {
				return message.channel.send(mod.user_404.replace('{action}', 'kick'));
			}
			++ctt;
		});
		message.channel.send({ embeds: [client.orangeEmbed(mod.mkick.replace('{count}', ctt.toString()))] });
	}
});
