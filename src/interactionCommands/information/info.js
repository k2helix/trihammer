const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'info',
	description: 'Get the info about an user',
	ESdesc: 'Consigue la información de un usuario',
	usage: 'info [user]',
	example: 'info @user\ninfo 717941566811144193\ninfo',
	aliases: ['userinfo', 'user'],
	type: 0,
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		let userNotFetched = interaction.options.getUser('user') || interaction.user;
		let user = await client.users.fetch(userNotFetched.id, { force: true });
		if (!user) return interaction.reply({ content: util.invalid_user, ephemeral: true });

		let member = interaction.guild.members.cache.get(user.id);
		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setAuthor(user.tag, avatar)
			.setColor(user.accentColor?.toString(16) || 'RANDOM')
			.setThumbnail(avatar)
			.setDescription(`<@${user.id}>`)

			.addField(
				`**__Information__**`,
				`**ID**: ${user.id}\n**Created**: <t:${Math.floor(user.createdTimestamp / 1000)}:R> **->** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n**Bot**: ${user.bot}`,
				false
			)
			.setImage(user.bannerURL({ dynamic: true, size: 1024 }));
		if (member)
			info_embed.addField(
				'**__Server Specific__**',
				`**Nickname**: ${member.displayName}\n**Joined**: <t:${Math.floor(member.joinedTimestamp / 1000)}:R> **->** <t:${Math.floor(
					member.joinedTimestamp / 1000
				)}:F>\n**Roles**: ${member.roles.cache
					.sort((b, a) => a.position - b.position || a.id - b.id)
					.map((r) => `${r}`)
					.join(' ')}`
			);

		interaction.reply({ embeds: [info_embed], ephemeral: interaction.isContextMenu() });
	}
};
