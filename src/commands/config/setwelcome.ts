import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'setwelcome',
	description: 'Set the welcome channel',
	aliases: ['welcome', 'welcomechannel', 'wchannel'],
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

		let welcome = await ModelWelc.findOne({ server: message.guild!.id });
		if (args[0] === 'disable') {
			welcome.canal = 'none';
			await welcome.save();
			return message.channel.send({ embeds: [client.orangeEmbed(config.role_set.disabled)] });
		}
		if (!welcome) {
			let newModel = new ModelWelc({
				server: message.guild!.id,
				canal: channel.id,
				color: '#ffffff',
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: `Welcome to ${message.guild!.name}`
			});
			welcome = newModel;
		}
		welcome.canal = channel.id;
		await welcome.save();
		message.channel.send({ embeds: [client.blueEmbed(config.channel_set.welcome.replace('{channel}', `<#${channel.id}>`))] });
	}
});
