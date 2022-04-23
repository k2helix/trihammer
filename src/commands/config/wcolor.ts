import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'wcolor',
	description: 'Set the welcome title color',
	aliases: ['welcome-color', 'welcomecolor'],
	category: 'configuration',
	required_args: [{ index: 0, name: 'color', type: 'string' }],
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		const { welcome } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let color = args[0];
		if (!color || !color.toLowerCase().startsWith('#')) return message.channel.send({ embeds: [client.redEmbed(welcome.hex)] });

		let welcomeModel = await ModelWelc.findOne({ server: message.guild!.id });
		if (!welcome) {
			let newModel = new ModelWelc({
				server: message.guild!.id,
				canal: 'none',
				color: color,
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: `Welcome to ${message.guild!.name}`
			});
			welcomeModel = newModel;
		}
		welcomeModel.color = color;
		await welcomeModel.save();
		message.channel.send({ embeds: [client.blueEmbed(welcome.wcolor.replace('{color}', color))] });
	}
});
