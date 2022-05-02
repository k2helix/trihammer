import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'avatar',
	description: 'Get the avatar of someone',
	aliases: ['icon', 'pfp'],
	category: 'information',
	required_args: [{ index: 0, name: 'user', type: 'user', optional: true }],
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let givenId = message.mentions.users.first()?.id || args[0] || message.author.id;
		let user = await client.users.fetch(givenId, { force: true }).catch(() => undefined);
		if (!user) return;

		let avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag}`)
			.setColor(user.hexAccentColor || 'RANDOM')
			.setDescription(`[Link](${avatar})`)
			.addField(util.sauce.more_source, util.sauce.search_sources(avatar))
			.setImage(avatar);
		message.channel.send({ embeds: [info_embed] });
	}
});
