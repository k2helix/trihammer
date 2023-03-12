import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs, ModelMutes } from '../../lib/utils/models';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
export default new Command({
	name: 'mute',
	description: 'Mute or tempmute a user',
	category: 'moderation',
	required_perms: ['ManageMessages'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageChannels', 'ManageRoles'],
	async execute(client, interaction, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember;
		if (!member.manageable) return interaction.reply({ embeds: [client.redEmbed(mod.not_moderatable)] });

		let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;

		let timeString = (interaction as ChatInputCommandInteraction).options.getString('duration') || 'N/A';
		let time = functions.Convert(timeString);

		let mutedRole = interaction.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');

		if (!mutedRole) {
			mutedRole = await interaction.guild!.roles.create({
				name: 'Trimuted',
				color: '#123456',
				position: interaction.guild!.members.me!.roles.highest.position - 1,
				reason: '[MUTED ROLE] I need it to mute people'
			});

			interaction.guild!.channels.cache.forEach((channel) => {
				if (channel.isTextBased() && !channel.isThread())
					channel.permissionOverwrites.create(mutedRole!, {
						SendMessages: false,
						AddReactions: false
					});
				if (channel.isVoiceBased())
					channel.permissionOverwrites.create(mutedRole!, {
						Connect: false,
						Speak: false
					});
			});
		}

		if (member.roles.cache.has(mutedRole.id))
			return interaction.reply({ embeds: [client.redEmbed(client.replaceEach(mod.has_role, { '{member}': `<@${member.id}>`, '{role}': 'Trimuted' }))] });

		if ((interaction as ChatInputCommandInteraction).options.getBoolean('notify'))
			member
				.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['muted'], '{server}': interaction.guild!.name, '{reason}': reason, '{time}': timeString }))
				.catch(() => undefined);

		member.roles.add(mutedRole, `[MUTE] Command used by ${interaction.user.tag}. Reason: ${reason} | Time: ${timeString}`);
		interaction.reply({
			embeds: [
				client.orangeEmbed(client.replaceEach(mod.temp_infr, { '{user}': member.user.tag, '{action}': mod.actions['muted'], '{reason}': reason, '{time}': timeString }))
			]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: interaction.guildId,
			duration: timeString,
			tipo: 'mute',
			time: `${interaction.createdTimestamp}`,
			mod: interaction.user.id,
			reason: reason
		});
		await newModel.save();

		if (time) {
			let expiration = Date.now() + time.tiempo;
			let newMute = new ModelMutes({
				key: key,
				id: member.id,
				server: interaction.guildId,
				expire: expiration,
				active: true
			});
			await newMute.save();
		}

		client.emit('infractionCreate', {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '🔇 MUTE',
			time: timeString,
			mod: interaction.user.tag,
			reason: reason,
			guild: interaction.guildId
		});
	}
});
