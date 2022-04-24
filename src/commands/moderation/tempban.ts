import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs, ModelTempban } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'tempban',
	description: 'Ban an user the specified time',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'time', type: 'string' },
		{ index: 2, name: 'reason', type: 'string', optional: true }
	],
	required_perms: ['BAN_MEMBERS'],
	required_roles: ['MODERATOR'],
	client_perms: ['BAN_MEMBERS'],
	async execute(client, message, args, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		if (!member.moderatable) return message.channel.send({ embeds: [client.redEmbed(mod.not_moderatable)] });

		let time = functions.Convert(args[1]);
		if (!time) return message.channel.send({ embeds: [client.redEmbed(mod.time_404)] });
		let timeString = args[1];
		let reason = args.slice(2).join(' ') || 'No';

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['banned'], '{server}': message.guild!.name, '{reason}': reason, '{time}': timeString }));
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}
		member.ban({ reason: `[TEMPBAN] Command used by ${message.author.tag} | Reason: ${reason} | Time: ${timeString}` });
		message.channel.send({
			embeds: [
				client.orangeEmbed(client.replaceEach(mod.temp_infr, { '{user}': member.user.tag, '{action}': mod.actions['banned'], '{reason}': reason, '{time}': timeString }))
			]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guildId,
			duration: timeString,
			tipo: 'tempban',
			time: `${message.createdTimestamp}`,
			mod: message.author.id,
			reason: reason
		});
		await newModel.save();

		if (time) {
			let expiration = Date.now() + time.tiempo;
			let newMute = new ModelTempban({
				key: key,
				id: member.id,
				server: message.guildId,
				expire: expiration,
				active: true
			});
			await newMute.save();
		}

		client.emit('infractionCreate', {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔨 TEMPBAN',
			time: timeString,
			mod: message.author.tag,
			reason: reason,
			guild: message.guildId
		});
	}
});
