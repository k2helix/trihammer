import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs } from '../../lib/utils/models';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
export default new Command({
	name: 'ban',
	description: 'Ban a user with the given reason',
	category: 'moderation',
	required_perms: ['BanMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['BanMembers'],
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember;
		let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;

		if (!member.moderatable) return interaction.reply({ embeds: [client.redEmbed(mod.not_moderatable)], ephemeral: true });
		if ((interaction as ChatInputCommandInteraction).options.getBoolean('notify'))
			member
				.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['banned'], '{server}': interaction.guild!.name, '{reason}': reason }))
				.catch(() => undefined);

		member.ban({ reason: `[BAN] Command used by ${interaction.user.tag} | Reason: ${reason}` });
		interaction.reply({
			embeds: [client.orangeEmbed(client.replaceEach(mod.infraction, { '{user}': member.user.tag, '{action}': mod.actions['banned'], '{reason}': reason }))]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: interaction.guildId,
			duration: 'N/A',
			tipo: 'ban',
			time: `${interaction.createdTimestamp}`,
			mod: interaction.user.id,
			reason: reason
		});
		await newModel.save();

		client.emit('infractionCreate', {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔨 BAN',
			time: 'N/A',
			mod: interaction.user.tag,
			reason: reason,
			guild: interaction.guildId
		});
	}
});
