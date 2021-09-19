const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: "Get your avatar (or one user's avatar)",
	ESdesc: 'Obtén tu avatar (o el de un usuario)',
	usage: 'avatar [user]',
	example: 'avatar\navatar @user\navatar 461279654158925825',
	aliases: ['icon', 'pfp'],
	type: 0,
	async execute(client, interaction, guildConf) {
		const { util } = require(`../../utils/lang/${guildConf.lang}`);
		let userNotFetched = interaction.options.getUser('user') || interaction.user;
		let user = await client.users.fetch(userNotFetched.id, { force: true });
		if (!user) return interaction.reply({ content: util.invalid_user, ephemeral: true });

		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag}`)
			.setColor(user.accentColor?.toString(16) || 'RANDOM')
			.setDescription(`[Link](${avatar})`)
			.addField(util.sauce.more_source, util.sauce.search_sources(avatar))
			.setImage(avatar);
		interaction.reply({ embeds: [info_embed], ephemeral: interaction.isContextMenu() });
	}
};
