const { ModelServer } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'unban',
	description: 'Unban a banned user',
	ESdesc: 'Desbanea a un usuario baneado',
	usage: 'unban <user>',
	example: 'unban 598894142554243081',
	aliases: ['desban'],
	type: 2,
	myPerms: [false, 'BAN_MEMBERS'],
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../lib/utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let id = args[0];
		let reason = args.slice(1).join(' ') || 'No';
		if (!id) return message.channel.send(mod.need_id);

		message.guild.members
			.unban(id, `[UNBAN] Command used by ${message.author.tag} | Reason: ${reason}`)
			.then((user) => {
				message.channel.send(mod.infraction.replaceAll({ '{user}': user.tag, '{action}': 'unbanned', '{reason}': reason }));

				let infraction = {
					user: {
						id: user.id,
						tag: user.tag
					},
					type: '🔧 UNBAN',
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
	}
};
