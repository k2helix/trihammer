const { ModelServer, ModelInfrs } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'mkick',
	description: 'Kick multiple users in one command',
	ESdesc: 'Expulsa múltiples usuarios en un comando',
	usage: 'mkick <users> -r <reason>',
	example: 'mkick 547523994669023334 618234417407852565 -r Spam',
	aliases: ['multikick'],
	cooldown: 5,
	type: 2,
	myPerms: [false, 'KICK_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let r = args.indexOf('-r');
		let reason = args.slice(r + 1).join(' ');
		if (r == -1) return message.channel.send('mkick <users> -r <reason> [md]');

		let ctt = 0;
		args.slice(0, r).forEach(async (id) => {
			let member = message.guild.members.cache.get(id);

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

				member.kick(`[MKICK] Command used by ${message.author.tag} | Reason: ${reason}`);

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
				return message.channel.send(mod.i_cant.replace('{action}', 'kick'));
			}
			++ctt;
		});
		message.channel.send(mod.mkick.replace('{count}', ctt));
	}
};
