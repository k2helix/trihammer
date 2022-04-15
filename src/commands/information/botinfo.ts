import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'botinfo',
	description: 'Bot info',
	category: 'information',
	aliases: ['about', 'invite'],
	async execute(client, message, _args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let embed = new MessageEmbed()
			.setTitle('Trihammer')
			.setDescription(client.replaceEach(util.about, { '{guilds}': client.guilds.cache.size.toString(), '{members}': client.users.cache.size.toString() }))
			.setThumbnail(client.user!.displayAvatarURL())
			.setTimestamp()
			.setColor(5814783);
		message.channel.send({ embeds: [embed] });
	}
});
