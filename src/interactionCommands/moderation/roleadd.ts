import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ChatInputCommandInteraction, GuildMember, Role } from 'discord.js';
export default new Command({
	name: 'roleadd',
	description: 'Add a role to the given user',
	category: 'moderation',
	required_perms: ['ManageRoles'],
	required_roles: ['ADMINISTRATOR'],
	client_perms: ['ManageRoles'],
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember;
		if (!member.manageable) return interaction.reply({ embeds: [client.redEmbed(mod.not_moderatable)], ephemeral: true });

		let role = (interaction as ChatInputCommandInteraction).options.getRole('role')! as Role;
		if (!role || role.comparePositionTo(interaction.guild!.members.me!.roles.highest) > 0)
			return interaction.reply({ embeds: [client.redEmbed(mod.role_404)], ephemeral: true });
		if (member.roles.cache.has(role.id))
			return interaction.reply({ embeds: [client.redEmbed(client.replaceEach(mod.has_role, { '{member}': `<@${member.id}>`, '{role}': role.name }))], ephemeral: true });
		member.roles
			.add(role, `[ADD ROLE] Command used by ${interaction.user.tag}`)
			.then(() => {
				interaction.reply({ embeds: [client.lightBlueEmbed(client.replaceEach(mod.role_added, { '{member}': member.user.tag, '{role}': role!.name }))] });
			})
			.catch((error) => interaction.reply(error.message));
	}
});
