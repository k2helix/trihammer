const { ModelServer, ModelInfrs, ModelTempban } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'tempban',
	description: 'Ban an user the specified time',
	ESdesc: 'Banea a un usuario el tiempo especificado',
	usage: 'tempban <user> <time> [reason] [dm]',
	example: 'tempban 598894142554243081 5d Spam -nodm',
	type: 2,
	myPerms: [false, 'BAN_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config, functions } = require(`../../lib/utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return message.channel.send(mod.need_id);

		let time = functions.Convert(args[1]);
		if (!time) return message.channel.send(mod.time_404);

		let timeString = args[1];
		let reason = args.slice(2).join(' ') || 'No';

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member.send(mod.infraction_md.replaceAll({ '{action}': 'tempbanned', '{server}': message.guild.name, '{reason}': reason, '{time}': timeString }));
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}
		member.ban({ reason: `[TEMPBAN] Command used by ${message.author.tag} | Reason: ${reason} | Time: ${timeString}` });
		message.channel.send(mod.temp_infr.replaceAll({ '{user}': member.user.tag, '{action}': 'tempbanned', '{reason}': reason, '{time}': timeString }));

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guild.id,
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
			type: '🔨 TEMPBAN',
			time: timeString,
			mod: message.author.tag,
			reason: reason,
			guild: message.guild.id
		};

		client.emit('infractionCreate', infraction);
	}
};
