import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'botinfo',
	description: 'Bot info',
	category: 'information',
	aliases: ['about', 'invite', 'support'],
	async execute(client, message, _args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const uptimeDate = Math.floor((Date.now() - (client.uptime || 0)) / 1000);
		let embed = new EmbedBuilder()
			.setTitle(client.user!.username)
			.setDescription(
				client.replaceEach(util.about, {
					'{username}': client.user!.username,
					'{invite_link}': `https://discord.com/oauth2/authorize?client_id=${client.user!.id}&permissions=8&scope=bot%20applications.commands`,
					'{invite_link_np}': `https://discord.com/oauth2/authorize?client_id=${client.user!.id}&permissions=0&scope=bot%20applications.commands`,
					'{guilds}': client.guilds.cache.size.toString(),
					'{members}': client.users.cache.size.toString(),
					'{time}': `<t:${uptimeDate}:R> (<t:${uptimeDate}>)`
				})
			)
			.setThumbnail(client.user!.displayAvatarURL())
			.setTimestamp()
			.setColor(5814783);
		message.channel.send({ embeds: [embed] });
	}
});
