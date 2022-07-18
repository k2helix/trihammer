import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ModelRank } from '../../lib/utils/models';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'setlevel',
	description: "Set someone's level to the specified",
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	category: 'social',
	async execute(client, interaction, guildConf) {
		const { xp } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let user = (interaction as ChatInputCommandInteraction).options.getUser('user')!;
		let level = (interaction as ChatInputCommandInteraction).options.getString('level')!;

		if (user.bot) return interaction.reply('nope');
		if (level.startsWith('-')) return interaction.reply('nope');

		let local = await ModelRank.findOne({ id: user.id, server: interaction.guild!.id });
		if (!local) {
			let newRankModel = new ModelRank({
				id: user.id,
				server: interaction.guild!.id,
				nivel: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		local.nivel = parseInt(level);
		await local.save();
		interaction.reply({ embeds: [client.blueEmbed(client.replaceEach(xp.level_set, { '{user}': user.tag, '{level}': parseInt(level).toString() }))] });
	}
});
