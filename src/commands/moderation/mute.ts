import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs, ModelMutes } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'mute',
	description: 'Mute or tempmute a user',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'time', type: 'string', optional: true },
		{ index: 2, name: 'reason', type: 'string', optional: true }
	],
	required_perms: ['ManageMessages'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	aliases: ['tempmute'],
	async execute(client, message, args, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0]);

		let time = functions.Convert(args[1]);
		let timeString = time ? args[1] : 'N/A';
		let reason = (time ? args.slice(2).join(' ') : args.slice(1).join(' ')) || 'No';

		let mutedRole = message.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');

		if (!mutedRole) {
			mutedRole = await message.guild!.roles.create({
				name: 'Trimuted',
				color: '#123456',
				position: message.guild!.members.me!.roles.highest.position - 1,
				reason: '[MUTED ROLE] I need it to mute people'
			});

			message.guild!.channels.cache.forEach((channel) => {
				if (channel.isTextBased() && !channel.isThread())
					channel.permissionOverwrites.create(mutedRole!, {
						SendMessages: false,
						AddReactions: false
					});
				else if (channel.isVoiceBased())
					channel.permissionOverwrites.create(mutedRole!, {
						Connect: false,
						Speak: false
					});
			});
		}

		if (member.roles.cache.has(mutedRole.id))
			return message.channel.send({ embeds: [client.redEmbed(client.replaceEach(mod.has_role, { '{member}': `<@${member.id}>`, '{role}': 'Trimuted' }))] });

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member
					.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['muted'], '{server}': message.guild!.name, '{reason}': reason, '{time}': timeString }))
					.catch(() => undefined);
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}
		member.roles.add(mutedRole, `[MUTE] Command used by ${message.author.tag}. Reason: ${reason} | Time: ${timeString}`);
		message.channel.send({
			embeds: [
				client.orangeEmbed(client.replaceEach(mod.temp_infr, { '{user}': member.user.tag, '{action}': mod.actions['muted'], '{reason}': reason, '{time}': timeString }))
			]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guildId,
			duration: timeString,
			tipo: 'mute',
			time: `${message.createdTimestamp}`,
			mod: message.author.id,
			reason: reason
		});
		await newModel.save();

		if (time) {
			let expiration = Date.now() + time.tiempo;
			let newMute = new ModelMutes({
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
			type: '🔇 MUTE',
			time: timeString,
			mod: message.author.tag,
			reason: reason,
			guild: message.guildId
		});
	}
});
