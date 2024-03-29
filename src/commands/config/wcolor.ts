import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'wcolor',
	description: 'Set the welcome title color',
	aliases: ['welcome-color', 'welcomecolor'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'color', type: 'string' }],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let color = args[0];
		if (!color || !color.toLowerCase().startsWith('#')) return message.channel.send({ embeds: [client.redEmbed(welcome.hex)] });

		let welcomeModel = await ModelWelc.findOne({ server: message.guild!.id });
		if (!welcomeModel) {
			let newModel = new ModelWelc({
				server: message.guild!.id,
				canal: 'none',
				color: color,
				image: 'assets/default-background.png',
				text: `Welcome to ${message.guild!.name}`
			});
			welcomeModel = newModel;
		}
		welcomeModel.color = color;
		await welcomeModel.save();
		message.channel.send({ embeds: [client.blueEmbed(welcome.wcolor.replace('{color}', color))] });
	}
});
