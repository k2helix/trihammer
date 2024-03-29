import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelServer } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'memberlogs',
	description: 'Set the members logs channel',
	aliases: ['member-logs'],
	category: 'configuration',
	required_args: [
		{ index: 0, name: 'disable', type: 'string', optional: true, ignore: true },
		{ index: 0, name: 'channel', type: 'channel', optional: true }
	],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let channel = message.mentions.channels.first() || message.guild!.channels.cache.get(args[0]) || message.channel;
		if (!channel.isTextBased()) return message.channel.send({ embeds: [client.redEmbed(config.only_text)] });
		const serverConfig = await ModelServer.findOne({ server: message.guild!.id });

		if (args[0] === 'disable') {
			serverConfig.memberlogs = 'none';
			await serverConfig.save();
			return message.channel.send({ embeds: [client.orangeEmbed(config.channel_set.disabled)] });
		} else serverConfig.memberlogs = channel.id;
		await serverConfig.save();
		message.channel.send({ embeds: [client.blueEmbed(config.channel_set.members.replace('{channel}', `<#${channel.id}>`))] });
	}
});
