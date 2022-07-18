import { EmbedBuilder } from 'discord.js';
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
		let avatar = user.displayAvatarURL({ extension: 'png', size: 1024 });
		let info_embed = new EmbedBuilder()
			.setAuthor({ name: user.tag, iconURL: avatar })
			.setColor(user.hexAccentColor || 'Random')
			.setThumbnail(avatar)
			.setDescription(`<@${user.id}>`)

			.addFields({ name: util.user.information, value: util.user.main_info(user), inline: false })
			.setImage(user.bannerURL({ size: 1024 }) as string | null);
		if (member) info_embed.addFields({ name: util.user.server, value: util.user.server_specific(member) });

		message.channel.send({ embeds: [info_embed] });
	}
});
