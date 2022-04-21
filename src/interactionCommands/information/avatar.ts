import { CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'avatar',
	description: 'Get the avatar of someone',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = (interaction as CommandInteraction).options.getUser('user')?.id || interaction.user.id;
		let user = await client.users.fetch(givenId, { force: true });
		if (!user) return interaction.reply({ embeds: [client.redEmbed(util.invalid_user)], ephemeral: true });

		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag}`)
			.setColor(user.hexAccentColor || 'RANDOM')
			.setDescription(`[Link](${avatar})`)
			.addField(util.sauce.more_source, util.sauce.search_sources(avatar))
			.setImage(avatar);
		interaction.reply({ embeds: [info_embed], ephemeral: interaction.isContextMenu() });
	}
});
