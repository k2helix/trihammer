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
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);
		if (!user) user = args[0] ? await client.users.fetch(args[0]) : message.author;

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag} ${user.bot ? '<:bot:783722324028293121>' : ''}`)
			.setColor('RANDOM')
			.setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))

			.addField(`🆔 ID:`, `${user.id}`, true)
			.addField(util.user.createdString, util.user.created(user), false);

		if (message.guild.members.cache.has(user.id)) {
			let member = message.guild.member(user);
			info_embed.addField(util.user.nickname, member.displayName, true);
			info_embed.addField(util.user.joinedString, util.user.joined(member), false);
			info_embed.addField(
				'🛡️ Roles:',
				member.roles.cache.map((r) => `${r}`).join(' ') === '@everyone'
					? 'No'
					: member.roles.cache
							.sort((b, a) => a.position - b.position || a.id - b.id)
							.map((r) => `${r}`)
							.join(' ')
							.replace('@everyone', ''),
				false
			);
		}
		message.channel.send({ embeds: [info_embed] });
	}
};
