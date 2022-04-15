import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
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
		if (args[0] === 'icon') return message.channel.send(guild.iconURL({ dynamic: true, format: 'png', size: 1024 })!);
		if (!guild) return message.channel.send(':x: No encontré el servidor');

		let owner = await guild.fetchOwner();
		let serverembed = new MessageEmbed()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })! })
			.setColor('RANDOM')
			.setThumbnail(guild.iconURL({ dynamic: true })!)
			.addField(util.user.information, util.server.main(guild, owner));

		message.channel.send({ embeds: [serverembed] });
	}
});
