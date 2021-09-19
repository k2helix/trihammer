const { ModelServer, ModelInfrs, ModelMutes } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'mute',
	description: 'Mute or tempmute an user',
	ESdesc: 'Mutea o tempmutea a un usuario',
	usage: 'mute <user> [time] [reason] [md]',
	example: 'mute 682582417625710592 1h Spam\nmute 682582417625710592 Spam',
	aliases: ['tempmute'],
	type: 2,
	myPerms: [false, 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config, functions } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return message.channel.send(mod.need_id);

		let time = functions.Convert(args[1]);
		let timeString = time ? args[1] : 'N/A';
		let reason = (time ? args.slice(2).join(' ') : args.slice(1).join(' ')) || 'No';

		let mutedRole = message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');

		if (!mutedRole) {
			mutedRole = await message.guild.roles.create({
				data: {
					name: 'Trimuted',
					color: '123456',
					position: message.guild.me.roles.highest.position - 1
				},
				reason: '[MUTED ROLE] I need it to mute people'
			});

			message.guild.channels.cache.forEach((channel) => {
				switch (channel.type) {
					case 'GUILD_TEXT':
						channel.permissionOverwrite.create(mutedRole, {
							SEND_MESSAGES: false,
							ADD_REACTIONS: false
						});
						break;
					case 'GUILD_VOICE':
						channel.permissionOverwrite.create(mutedRole, {
							CONNECT: false,
							SPEAK: false
						});
						break;
				}
			});
		}

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member.send(mod.infraction_md.replaceAll({ '{action}': 'muted', '{server}': message.guild.name, '{reason}': reason, '{time}': timeString }));
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}
		member.roles.add(mutedRole, `[MUTE] Command used by ${message.author.tag}. Reason: ${reason} | Time: ${timeString}`);
		message.channel.send(mod.temp_infr.replaceAll({ '{user}': member.user.tag, '{action}': 'muted', '{reason}': reason, '{time}': timeString }));

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guild.id,
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
				server: message.guild.id,
				expire: expiration,
				active: true
			});
			await newMute.save();
		}

		let infraction = {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔇 MUTE',
			time: timeString,
			mod: message.author.tag,
			reason: reason,
			guild: message.guild.id
		};

		client.emit('infractionCreate', infraction);
	}
};
