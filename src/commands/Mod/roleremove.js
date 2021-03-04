const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'roleremove',
	description: 'Remove a role to the given user',
	ESdesc: 'Quita un rol al usuario dado',
	usage: 'roleremove <user> <role name or id>',
	example: 'roleremove @user Muted',
	aliases: ['roles.remove', 'removerole'],
	type: 2,
	myPerms: [false, 'MANAGE_ROLES'],
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('MANAGE_ROLES');
		if (!permiso) return message.channel.send(config.admin_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return message.channel.send(mod.user_404);

		let role =
			message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
		if (!role) return message.channel.send(mod.role_404.replace('{id}', args.slice(1).join(' ')));

		try {
			member.roles.remove(role, `[REMOVE ROLE] Command used by ${message.author.tag}`);
			message.channel.send(mod.role_removed.replaceAll({ '{member}': member.user.tag, '{role}': role.name }));
		} catch (error) {
			message.channel.send(error.message);
		}
	}
};
