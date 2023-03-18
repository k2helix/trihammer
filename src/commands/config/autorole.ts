import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelServer } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'autorole',
	description: 'Set the auto role (the role given to new members)',
	aliases: ['auto-role'],
	category: 'configuration',
	required_args: [
		{ index: 0, name: 'disable', type: 'string', optional: true, ignore: true },
		{ index: 0, name: 'role', type: 'role', optional: true }
	],
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		let role =
			message.mentions.roles.first() ||
			message.guild!.roles.cache.find((r) => r.name === args.join(' ')) ||
			message.guild!.roles.cache.get(args[0]) ||
			message.member!.roles.highest;
		const serverConfig = await ModelServer.findOne({ server: message.guild!.id });
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (args[0] === 'disable') {
			serverConfig.autorole = 'none';
			await serverConfig.save();
			return message.channel.send({ embeds: [client.orangeEmbed(config.role_set.disabled)] });
		} else serverConfig.autorole = role!.id;
		await serverConfig.save();
		message.channel.send({ embeds: [client.blueEmbed(config.role_set.auto.replace('{role}', role!.name))] });
	}
});
