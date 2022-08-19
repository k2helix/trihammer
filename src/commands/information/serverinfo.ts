import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'serverinfo',
	description: 'Server information',
	aliases: ['server', 'server-info'],
	category: 'information',
	required_args: [{ index: 0, name: 'icon', type: 'string', optional: true }],
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let guild = message.guild!;

		if (!isNaN(parseInt(args[0]))) guild = client.guilds.cache.get(args[0])!;
		if (args[0] === 'icon') return message.channel.send(guild.iconURL({ extension: 'png', size: 1024 })!);
		if (!guild) return message.channel.send(':x: No encontré el servidor');

		let owner = await guild.fetchOwner();
		let serverembed = new EmbedBuilder()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
			.setColor('Random')
			.setThumbnail(guild.iconURL()!)
			.addFields({ name: util.user.information, value: util.server.main(guild, owner) })
			.setImage(guild.bannerURL({ size: 1024 }));

		message.channel.send({ embeds: [serverembed] });
	}
});
