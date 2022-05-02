import { MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'info',
	description: 'Get info about a user',
	aliases: ['userinfo', 'user'],
	category: 'information',
	required_args: [{ index: 0, name: 'user', type: 'user', optional: true }],
	async execute(client, message, args, guildConf) {
		let givenId = message.mentions.users.first()?.id || args[0] || message.author.id;
		let user = await client.users.fetch(givenId, { force: true }).catch(() => undefined);

		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!user) return message.channel.send({ content: util.invalid_user });

		let member = await message.guild!.members.fetch(givenId).catch(() => undefined);
		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setAuthor({ name: user.tag, iconURL: avatar })
			.setColor(user.hexAccentColor || 'RANDOM')
			.setThumbnail(avatar)
			.setDescription(`<@${user.id}>`)

			.addField(util.user.information, util.user.main_info(user), false)
			.setImage(user.bannerURL({ dynamic: true, size: 1024 })!);
		if (member) info_embed.addField(util.user.server, util.user.server_specific(member));

		message.channel.send({ embeds: [info_embed] });
	}
});
