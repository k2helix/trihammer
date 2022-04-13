const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'roleadd',
	description: 'Add a role to the given user',
	ESdesc: 'Añade un rol al usuario dado',
	usage: 'roleadd <user> <role name or id>',
	example: 'roleadd @user Muted',
	aliases: ['roles.add', 'addrole'],
	type: 2,
	myPerms: [false, 'MANAGE_ROLES'],
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../lib/utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES);
		if (!permiso) return message.channel.send(config.admin_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return message.channel.send(mod.user_404);

		let role =
			message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
		if (!role) return message.channel.send(mod.role_404.replace('{id}', args.slice(1).join(' ')));

		try {
			member.roles.add(role, `[ADD ROLE] Command used by ${message.author.tag}`);
			message.channel.send(mod.role_added.replaceAll({ '{member}': member.user.tag, '{role}': role.name }));
		} catch (error) {
			message.channel.send(error.message);
		}
	}
};