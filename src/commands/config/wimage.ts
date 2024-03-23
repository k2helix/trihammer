import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'wimage',
	description: 'Set the welcome image',
	aliases: ['welcome-image', 'welcomeimage'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'image', type: 'string' }],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let image = args[0];
		if (!image || !image.toLowerCase().startsWith('http') || image.includes('cdn.discord')) return message.channel.send({ embeds: [client.redEmbed(welcome.need_url)] });

		let welcomeModel = await ModelWelc.findOne({ server: message.guild!.id });
		if (!welcomeModel) {
			let newModel = new ModelWelc({
				server: message.guild!.id,
				canal: 'none',
				color: '#ffffff',
				image: image,
				text: `Welcome to ${message.guild!.name}`
			});
			welcomeModel = newModel;
		}
		welcomeModel.image = image;
		await welcomeModel.save();
		message.channel.send({ embeds: [client.blueEmbed(welcome.wimage)] });
	}
});
