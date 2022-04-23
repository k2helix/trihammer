import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelServer } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'setlang',
	description: 'Set the server language',
	aliases: ['language', 'idioma', 'lang'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'language', type: 'string' }],
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let language = args[0];
		if (!['es', 'en'].includes(language.toLowerCase())) return message.channel.send({ embeds: [client.redEmbed(config.current_languages)] });

		const serverConfig = await ModelServer.findOne({ server: message.guild!.id });

		serverConfig.lang = language.toLowerCase();
		serverConfig.save();
		message.channel.send({ embeds: [client.blueEmbed(config.lang_set.replace('{idioma}', language))] });
	}
});
