import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs, ModelMutes } from '../../lib/utils/models';
import { CommandInteraction, GuildMember } from 'discord.js';
export default new Command({
	name: 'mute',
	description: 'Mute or tempmute a user',
	category: 'moderation',
	required_perms: ['MANAGE_MESSAGES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	async execute(client, interaction, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as CommandInteraction).options.getMember('user')! as GuildMember;
		let reason = (interaction as CommandInteraction).options.getString('reason')!;

		let timeString = (interaction as CommandInteraction).options.getString('duration') || 'N/A';
		let time = functions.Convert(timeString);

		let mutedRole = interaction.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');

		if (!mutedRole) {
			mutedRole = await interaction.guild!.roles.create({
				name: 'Trimuted',
				color: '#123456',
				position: interaction.guild!.me!.roles.highest.position - 1,
				reason: '[MUTED ROLE] I need it to mute people'
			});

			interaction.guild!.channels.cache.forEach((channel) => {
				if (channel.isText() && !channel.isThread())
					channel.permissionOverwrites.create(mutedRole!, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false
					});
				else if (channel.isVoice())
					channel.permissionOverwrites.create(mutedRole!, {
						CONNECT: false,
						SPEAK: false
					});
			});
		}

		if ((interaction as CommandInteraction).options.getBoolean('notify'))
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
