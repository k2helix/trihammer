import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'timeout',
	description: 'Timeout a member',
	category: 'moderation',
	required_perms: ['ModerateMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['ModerateMembers'],
	async execute(client, interaction, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember,
			reason = (interaction as ChatInputCommandInteraction).options.getString('reason') || 'No reason',
			timeString = (interaction as ChatInputCommandInteraction).options.getString('duration')!,
			time = functions.Convert(timeString);

		if (!member.moderatable) return interaction.reply({ embeds: [client.redEmbed(mod.not_moderatable)], ephemeral: true });
		if (!time) return interaction.reply({ embeds: [client.redEmbed(mod.time_404)], ephemeral: true });

		if (timeString.startsWith('0')) {
			member.timeout(null, (reason || 'No reason') + ` | by ${interaction.user.tag}`);
			return interaction.reply({ embeds: [client.orangeEmbed(mod.timeout.clear.replace('{member}', member.user.tag))] });
		} else if (member.isCommunicationDisabled()) return interaction.reply({ embeds: [client.redEmbed(mod.timeout.already_timed_out)], ephemeral: true });

		if (time.tiempo >= 2419200000) return interaction.reply({ embeds: [client.redEmbed(mod.timeout.time)], ephemeral: true });

		member.timeout(time.tiempo, reason + ` | by ${interaction.user.tag}`);
		interaction.reply({
			embeds: [
				client.orangeEmbed(
					client.replaceEach(mod.timeout.timeout, {
						'{member}': member.user.tag,
						'{duration}': time.nombre,
						'{reason}': reason || 'No'
					})
				)
			]
		});
	}
});
