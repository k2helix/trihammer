import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs, ModelTempban } from '../../lib/utils/models';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
export default new Command({
	name: 'tempban',
	description: 'Ban a user the specified time',
	category: 'moderation',
	required_perms: ['BanMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['BanMembers'],
	async execute(client, interaction, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let member = (interaction as ChatInputCommandInteraction).options.getMember('user')! as GuildMember;
		let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;

		let timeString = (interaction as ChatInputCommandInteraction).options.getString('duration') || 'N/A';
		let time = functions.Convert(timeString);

		if ((interaction as ChatInputCommandInteraction).options.getBoolean('notify'))
			member
				.send(client.replaceEach(mod.infraction_md, { '{action}': mod.actions['banned'], '{server}': interaction.guild!.name, '{reason}': reason, '{time}': timeString }))
				.catch(() => undefined);

		member.ban({ reason: `[TEMPBAN] Command used by ${interaction.user.tag} | Reason: ${reason} | Time: ${timeString}` });
		interaction.reply({
			embeds: [
				client.orangeEmbed(client.replaceEach(mod.temp_infr, { '{user}': member.user.tag, '{action}': mod.actions['banned'], '{reason}': reason, '{time}': timeString }))
			]
		});

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: interaction.guildId,
			duration: timeString,
			tipo: 'tempban',
			time: `${interaction.createdTimestamp}`,
			mod: interaction.user.id,
			reason: reason
		});
		await newModel.save();

		if (time) {
			let expiration = Date.now() + time.tiempo;
			let newMute = new ModelTempban({
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
			type: '🔨 TEMPBAN',
			time: timeString,
			mod: interaction.user.tag,
			reason: reason,
			guild: interaction.guildId
		});
	}
});
