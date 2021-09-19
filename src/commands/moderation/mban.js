const { ModelInfrs, ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'mban',
	description: 'Ban multiple users in one command',
	ESdesc: 'Banea múltiples usuarios en un comando',
	usage: 'mban <users> -r <reason>',
	example: 'mban 547523994669023334 618234417407852565 -r Raid',
	cooldown: 5,
	aliases: ['multiban'],
	type: 2,
	myPerms: [false, 'BAN_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let r = args.indexOf('-r');
		let reason = args.slice(r + 1).join(' ');
		let ctt = 0;
		if (r == -1) return message.channel.send('mban <users> -r <reason>');
		args.slice(0, r).forEach((id) => {
			message.guild.members
				.ban(id, { reason: `[MBAN] Command used by ${message.author.tag} | Reason: ${reason}` })
				.then(async (user) => {
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
				.catch(() => {
					return message.channel.send(mod.user_404.replace('{id}', id));
				});
			++ctt;
		});
		message.channel.send(mod.mban.replace('{count}', ctt));
	}
};
