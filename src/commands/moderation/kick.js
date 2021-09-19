const { ModelServer, ModelInfrs } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kick an user with the specified reason',
	ESdesc: 'Expulsa a un usuario con la razón especificada',
	usage: 'kick <user> <reason>',
	aliases: ['expulsar'],
	type: 2,
	myPerms: [false, 'KICK_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'No';

		if (!member) return message.channel.send(mod.need_id);

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		try {
			switch (sendDM) {
				case true:
					member.send(mod.infraction_md.replaceAll({ '{action}': 'kicked', '{server}': message.guild.name, '{reason}': reason }));
					break;

				case false:
					reason = reason.slice(0, reason.indexOf('-nodm'));
					break;
			}

			member.kick(`[KICK] Command used by ${message.author.tag} | Reason: ${reason}`);
			message.channel.send(mod.infraction.replaceAll({ '{user}': member.user.tag, '{action}': 'kicked', '{reason}': reason }));

			let infrs = await ModelInfrs.find().lean();
			let key = infrs.length;
			let newModel = new ModelInfrs({
				key: key,
				id: member.id,
				server: message.guild.id,
				duration: 'N/A',
				tipo: 'kick',
				time: `${message.createdTimestamp}`,
				mod: message.author.id,
				reason: reason
			});
			await newModel.save();

			let infraction = {
				user: {
					id: member.id,
					tag: member.user.tag
				},
				type: '👢 KICK',
				time: 'N/A',
				mod: message.author.tag,
				reason: reason,
				guild: message.guild.id
			};

			client.emit('infractionCreate', infraction);
		} catch (err) {
			message.channel.send(mod.i_cant.replace('{action}', 'kick'));
		}
	}
};
