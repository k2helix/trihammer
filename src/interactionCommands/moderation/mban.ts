import { ChatInputCommandInteraction, GuildTextBasedChannel, User } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs } from '../../lib/utils/models';
export default new Command({
	name: 'mban',
	description: 'Ban multiple users in one command',
	cooldown: 5,
	category: 'moderation',
	required_perms: ['BanMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['BanMembers'],
	execute(client, interaction, guildConf) {
		interaction.deferReply().then(async () => {
			const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

			let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;
			let ctt = 0;
			(interaction as ChatInputCommandInteraction).options
				.getString('users')!
				.split(' ')
				.forEach((id) => {
					interaction
						.guild!.members.ban(id, { reason: `[MBAN] Command used by ${interaction.user.tag} | Reason: ${reason}` })
						.then(async (user) => {
							let infrs = await ModelInfrs.find().lean();
							let key = infrs.length;
							let newModel = new ModelInfrs({
								key: key,
								id: (user as User).id,
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
						.catch(() => {
							return (interaction.channel as GuildTextBasedChannel)!.send(mod.user_404.replace('{id}', id));
						});
					++ctt;
				});
			interaction.editReply({ embeds: [client.orangeEmbed(mod.mban.replace('{count}', ctt.toString()))] });
		});
	}
});
