import { CommandInteraction, MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'info',
	description: 'Get info about a user',
	category: 'information',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = (interaction as CommandInteraction).options.getUser('user')?.id || interaction.user.id;
		let user = await client.users.fetch(givenId, { force: true });
		if (!user) return interaction.reply({ embeds: [client.redEmbed(util.invalid_user)], ephemeral: true });

		let member = await interaction.guild!.members.fetch(givenId).catch(() => undefined);
		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: avatar })
			.setColor(user.hexAccentColor || 'RANDOM')
			.setThumbnail(avatar)
			.setDescription(`<@${user.id}>`)

			.addField(util.user.information, util.user.main_info(user), false)
			.setImage(user.bannerURL({ dynamic: true, size: 1024 })!);
		if (member) info_embed.addField(util.user.server, util.user.server_specific(member));

		interaction.reply({ embeds: [info_embed] });
	}
});
