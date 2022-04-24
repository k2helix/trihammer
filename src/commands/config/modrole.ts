import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelServer } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'modrole',
	description: 'Set the moderator role',
	aliases: ['mod-role', 'moderator-role'],
	category: 'configuration',
	required_args: [
		{ index: 0, name: 'disable', type: 'string', optional: true, ignore: true },
		{ index: 0, name: 'role', type: 'role' }
	],
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, message, args, guildConf) {
		let role = message.mentions.roles.first() || message.guild!.roles.cache.find((r) => r.name === args.join(' ')) || message.guild!.roles.cache.get(args[0]);
		const serverConfig = await ModelServer.findOne({ server: message.guild!.id });
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (args[0] === 'disable') {
			serverConfig.modrole = 'none';
			await serverConfig.save();
			return message.channel.send({ embeds: [client.orangeEmbed(config.role_set.disabled)] });
		} else serverConfig.modrole = role!.id;
		await serverConfig.save();
		message.channel.send({ embeds: [client.blueEmbed(config.role_set.mod.replace('{role}', role!.name))] });
	}
});
