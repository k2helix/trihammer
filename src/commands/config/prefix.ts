import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelServer } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'prefix',
	description: 'Set the server prefix',
	aliases: ['setprefix'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'prefix', type: 'string' }],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		let prefix = args.join(' ');
		if (!prefix) return;
		if (prefix.length > 10) return message.channel.send('No.');

		const serverConfig = await ModelServer.findOne({ server: message.guild!.id });
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		serverConfig.prefix = prefix;
		serverConfig.save();
		message.channel.send({ embeds: [client.blueEmbed(config.prefix_set.replace('{prefix}', prefix))] });
	}
});
