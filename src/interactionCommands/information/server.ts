import Command from '../../lib/structures/Command';
import { EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'server',
	description: 'Server information',
	category: 'information',
	async execute(_client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let guild = interaction.guild!;

		let owner = await guild.fetchOwner();
		let serverembed = new EmbedBuilder()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
			.setColor('Random')
			.setThumbnail(guild.iconURL()!)
			.addFields({ name: util.user.information, value: util.server.main(guild, owner) })
			.setImage(guild.bannerURL({ size: 1024 }));

		interaction.reply({ embeds: [serverembed] });
	}
});
