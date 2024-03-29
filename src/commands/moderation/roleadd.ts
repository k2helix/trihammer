import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'roleadd',
	description: 'Add a role to the given user',
	aliases: ['roles.add', 'addrole'],
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'role', type: 'role', ignore: true }
	],
	required_perms: ['ManageRoles'],
	required_roles: ['ADMINISTRATOR'],
	client_perms: ['ManageRoles'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		if (!member.manageable) return message.channel.send({ embeds: [client.redEmbed(mod.not_moderatable)] });

		let role =
			message.mentions.roles.first() ||
			message.guild!.roles.cache.get(args[1]) ||
			message.guild!.roles.cache.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
		if (!role || role.comparePositionTo(message.guild!.members.me!.roles.highest) > 0) return message.channel.send({ embeds: [client.redEmbed(mod.role_404)] });
		if (member.roles.cache.has(role.id))
			return message.channel.send({ embeds: [client.redEmbed(client.replaceEach(mod.has_role, { '{member}': `<@${member.id}>`, '{role}': role.name }))] });
		member.roles
			.add(role, `[ADD ROLE] Command used by ${message.author.tag}`)
			.then(() => {
				message.channel.send({ embeds: [client.lightBlueEmbed(client.replaceEach(mod.role_added, { '{member}': member.user.tag, '{role}': role!.name }))] });
			})
			.catch((error) => message.channel.send({ embeds: [client.redEmbed(error.message)] }));
	}
});
