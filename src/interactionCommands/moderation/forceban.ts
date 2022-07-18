import { ChatInputCommandInteraction, User } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs } from '../../lib/utils/models';
export default new Command({
	name: 'forceban',
	description: 'Ban a user which is not in the server',
	category: 'moderation',
	required_perms: ['BanMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['BanMembers'],
	async execute(client, interaction, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let id = (interaction as ChatInputCommandInteraction).options.getString('user')!;
		let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;

		interaction
			.guild!.members.ban(id, { reason: `[FORCEBAN] Command used by ${interaction.user.tag} | Reason: ${reason}` })
			.then(async (user) => {
				interaction.reply({
					embeds: [client.blueEmbed(client.replaceEach(mod.infraction, { '{user}': (user as User).tag, '{action}': mod.actions['banned'], '{reason}': reason }))]
				});

				let infrs = await ModelInfrs.find().lean();
				let key = infrs.length;
				let newModel = new ModelInfrs({
					key: key,
					id: (user as User).id,
					server: interaction.guildId!,
					duration: 'N/A',
					tipo: 'ban',
					time: `${interaction.createdTimestamp}`,
					mod: interaction.user.id,
					reason: reason
				});
				await newModel.save();

				client.emit('infractionCreate', {
					user: {
						id: (user as User).id,
						tag: (user as User).tag
					},
					type: '🔨 FORCEBAN',
					time: 'N/A',
					mod: interaction.user.tag,
					reason: reason,
					guild: interaction.guildId
				});
			})
			.catch((error) => {
				console.error(error);
				interaction.reply({ embeds: [client.redEmbed(mod.user_404.replace('{id}', id))] });
			});
	}
});
