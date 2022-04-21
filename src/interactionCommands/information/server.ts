import Command from '../../lib/structures/Command';
import { MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'server',
	description: 'Server information',
	category: 'information',
	async execute(_client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let guild = interaction.guild!;

		let owner = await guild.fetchOwner();
		let serverembed = new MessageEmbed()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })! })
			.setColor('RANDOM')
			.setThumbnail(guild.iconURL({ dynamic: true })!)
			.addField(util.user.information, util.server.main(guild, owner));

		interaction.reply({ embeds: [serverembed] });
	}
});
