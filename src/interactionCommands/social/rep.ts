import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'rep',
	description: 'Give a reputation point to a member',
	category: 'social',
	async execute(client, interaction, guildConf) {
		const { xp } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let user = (interaction as CommandInteraction).options.getUser('user')!;
		if (user.bot) return interaction.reply({ embeds: [client.redEmbed('Bots do not have profile!')] });

		let author = await ModelUsers.findOne({ id: interaction.user.id });
		let given = await ModelUsers.findOne({ id: user.id });

		if (author.repcooldown > Date.now()) return interaction.reply({ embeds: [client.redEmbed(xp.rep.cooldown(author.repcooldown - Date.now(), guildConf.prefix))] });
		else {
			author.repcooldown = Date.now() + 43200000;
			if (user.id === interaction.user.id) return interaction.reply({ content: ':thinking:', ephemeral: true });
			given.rep = given.rep + 1;
			await author.save();
			await given.save();

			let obj = {
				'{author}': interaction.user.username,
				'{user}': user.username
			};
			interaction.reply({ embeds: [client.lightBlueEmbed(client.replaceEach(xp.rep.added, obj))] });
		}
	}
});
