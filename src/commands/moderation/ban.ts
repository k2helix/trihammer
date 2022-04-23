import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

import { ModelInfrs } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'ban',
	description: 'Ban an user with the given reason',
	aliases: ['permaban'],
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'reason', type: 'string' }
	],
	required_perms: ['BAN_MEMBERS'],
	required_roles: ['MODERATOR'],
	client_perms: ['BAN_MEMBERS'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		let reason = args.slice(1).join(' ') || 'No';

		if (!member.moderatable) return message.channel.send({ embeds: [client.redEmbed(mod.not_moderatable)] });
		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['banned'], '{server}': message.guild!.name, '{reason}': reason }));
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}

		member.ban({ reason: `[BAN] Command used by ${message.author.tag} | Reason: ${reason}` });
		message.channel.send({
			embeds: [client.orangeEmbed(client.replaceEach(mod.infraction, { '{user}': member.user.tag, '{action}': mod.actions['banned'], '{reason}': reason }))]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guild!.id,
			duration: 'N/A',
			tipo: 'ban',
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
			type: '🔨 BAN',
			time: 'N/A',
			mod: message.author.tag,
			reason: reason,
			guild: message.guildId
		});
	}
});
