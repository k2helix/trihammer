const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'info',
	description: 'Get the info about an user',
	ESdesc: 'Consigue la información de un usuario',
	usage: 'info [user]',
	example: 'info @user\ninfo 717941566811144193\ninfo',
	aliases: ['userinfo', 'user'],
	type: 0,
	async execute(client, message, args) {
		message.guild.members.fetch(args[0]).catch((error) => error);
		let userNotFetched = message.mentions.users.first() || client.users.cache.get(args[0]);
		if (!userNotFetched) userNotFetched = args[0] ? await client.users.fetch(args[0]) : message.author;

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let user = await client.users.fetch(userNotFetched.id, { force: true });
		if (!user) return message.channel.send({ content: util.invalid_user });

		let member = message.guild.members.cache.get(user.id);
		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: avatar })
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
					.join(' ')}`.slice(0, 1000)
			);

		message.channel.send({ embeds: [info_embed] });
	}
};
