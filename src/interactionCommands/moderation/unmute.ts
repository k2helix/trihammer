import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
export default new Command({
	name: 'unmute',
	description: 'Unmute a user',
	category: 'moderation',
	required_perms: ['ManageMessages'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember;
		let reason = (interaction as ChatInputCommandInteraction).options.getString('reason') || 'No';

		let mutedRole = interaction.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
		if (!mutedRole) return interaction.reply({ embeds: [client.redEmbed(mod.no_muted_role)] });

		if (!member.roles.cache.has(mutedRole.id))
			return interaction.reply({ embeds: [client.redEmbed(client.replaceEach(mod.has_role_nt, { '{member}': `<@${member.id}>`, '{role}': 'Trimuted' }))] });
		member.roles.remove(mutedRole, `[UNMUTE] Command used by ${interaction.user.tag} | Reason: ${reason}`);
		interaction.reply({
			embeds: [client.orangeEmbed(client.replaceEach(mod.infraction, { '{user}': member.user.tag, '{action}': mod.actions['unmuted'], '{reason}': reason }))]
		});

		client.emit('infractionCreate', {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔊 UNMUTE',
			time: 'N/A',
			mod: interaction.user.tag,
			reason: reason,
			guild: interaction.guildId
		});
	}
});
