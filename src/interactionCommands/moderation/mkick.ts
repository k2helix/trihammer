import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelInfrs } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'mkick',
	description: 'Kick multiple users in one command',
	category: 'moderation',
	required_perms: ['KickMembers'],
	required_roles: ['MODERATOR'],
	client_perms: ['KickMembers'],
	cooldown: 5,
	execute(client, interaction, guildConf) {
		interaction.deferReply().then(async () => {
			const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

			let reason = (interaction as ChatInputCommandInteraction).options.getString('reason')!;
			let ctt = 0;
			(interaction as ChatInputCommandInteraction).options
				.getString('users')!
				.split(' ')
				.forEach(async (id) => {
					let member = interaction.guild!.members.cache.get(id)!;
					try {
						member.kick(`[MKICK] Command used by ${interaction.user.tag} | Reason: ${reason}`);

						let infrs = await ModelInfrs.find().lean();
						let key = infrs.length;
						let newModel = new ModelInfrs({
							key: key,
							id: member.id,
							server: interaction.guildId,
							duration: 'N/A',
							tipo: 'kick',
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
							type: '👢 KICK',
							time: 'N/A',
							mod: interaction.user.tag,
							reason: reason,
							guild: interaction.guildId
						});
					} catch (err) {
						return interaction.channel!.send(mod.user_404.replace('{action}', 'kick'));
					}
					++ctt;
				});
			interaction.editReply({ embeds: [client.orangeEmbed(mod.mkick.replace('{count}', ctt.toString()))] });
		});
	}
});
