import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'wmessage',
	description: 'Set the welcome message',
	aliases: ['welcome-message', 'welcomemessage'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'message', type: 'string' }],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let msg = args.join(' ');
		let welcomeModel = await ModelWelc.findOne({ server: message.guild!.id });
		if (!welcomeModel) {
			let newModel = new ModelWelc({
				server: message.guild!.id,
				canal: 'none',
				color: '#ffffff',
				image: 'assets/default-background.png',
				text: msg
			});
			welcomeModel = newModel;
		}
		welcomeModel.text = msg;
		await welcomeModel.save();
		message.channel.send({ embeds: [client.blueEmbed(welcome.wmessage)] });
	}
});
