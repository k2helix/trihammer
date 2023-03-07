import Command from '../../lib/structures/Command';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ModelRank, ModelUsers, Rank } from '../../lib/utils/models';
import RankCanvas from '../../lib/structures/interfaces/CanvasInterfaces';

export default new Command({
	name: 'rank',
	description: 'Get your rank card',
	cooldown: 3,
	category: 'social',
	client_perms: ['AttachFiles'],
	execute(client, interaction) {
		interaction.deferReply().then(async () => {
			let user = (interaction as ChatInputCommandInteraction).options.getUser('user') || interaction.user;
			if (user.bot) return interaction.editReply({ embeds: [client.redEmbed('Bots do not have profile!')] });

			let local = await ModelRank.findOne({ id: user.id, server: interaction.guildId }).lean();
			if (!local) return interaction.editReply({ embeds: [client.redEmbed('404 User not found in database (send some messages and try again)')] });

			let gl = await ModelUsers.findOne({ id: user.id }).lean();
			if (!gl) return interaction.editReply({ embeds: [client.redEmbed('404 User not found in database (send some messages and try again)')] });

			let url = gl.rimage;
			if (url === 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true')
				url = 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png';

			let top: Rank[] = await ModelRank.find({ server: interaction.guildId }).lean();
			let position = (element: Rank) => element.id === user.id && element.server === interaction.guildId;

			const rank = new RankCanvas()
				.setAvatar(user.displayAvatarURL({ extension: 'png' }))
				.setBackground('IMAGE', url)
				.setRank(
					top
						.sort((a, b) => {
							return b.nivel - a.nivel || b.xp - a.xp;
						})
						.findIndex(position) + 1
				)
				.setLevel(local.nivel)
				.setCurrentXP(local.xp)
				.setRequiredXP(Math.floor(local.nivel / 0.0081654953837673))
				.setProgressBar('#FFFFFF', 'COLOR')
				.setUsername(user.username)
				.setDiscriminator(user.discriminator);

			const attachment = new AttachmentBuilder(await rank.build(), { name: 'rank-image.png' });
			interaction.editReply({ files: [attachment] });
		});
	}
});
