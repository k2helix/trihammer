const { ModelServer, ModelInfrs } = require('../../utils/models');
module.exports = {
	name: 'forceban',
	description: 'Ban an user which is not in the server',
	ESdesc: 'Banea a un usuario que no está en el servidor',
	usage: 'forceban <user> <reason>',
	example: 'forceban 714567840581287936 Raid',
	aliases: ['hackban'],
	type: 2,
	myPerms: [false, 'BAN_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let id = args[0];
		if (!id) return message.channel.send(mod.need_id);

		let reason = args.slice(1).join(' ') || 'No';

		message.guild.members
			.ban(id, { reason: `[FORCEBAN] Command used by ${message.author.tag} | Reason: ${reason}` })
			.then(async (user) => {
				message.channel.send(mod.infraction.replaceAll({ '{user}': user.tag, '{action}': 'forcebanned', '{reason}': reason }));

				let infrs = await ModelInfrs.find().lean();
				let key = infrs.length;
				let newModel = new ModelInfrs({
					key: key,
					id: user.id,
					server: message.guild.id,
					duration: 'N/A',
					tipo: 'ban',
					time: `${message.createdTimestamp}`,
					mod: message.author.id,
					reason: reason
				});
				await newModel.save();

				let infraction = {
					user: {
						id: user.id,
						tag: user.tag
					},
					type: '🔨 FORCEBAN',
					time: 'N/A',
					mod: message.author.tag,
					reason: reason,
					guild: message.guild.id
				};

				client.emit('infractionCreate', infraction);
			})
			.catch((error) => {
				console.error(error);
				message.channel.send(mod.user_404.replace('{id}', id));
			});
	}
};
