import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'delinf',
	description: 'Delete the infraction with the given id',
	category: 'moderation',
	required_args: [{ index: 0, name: 'infraction id', type: 'string' }],
	required_roles: ['MODERATOR'],
	required_perms: ['MANAGE_MESSAGES'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		await ModelInfrs.deleteOne({ server: message.guildId, key: args[0] });
		message.channel.send({ embeds: [client.blueEmbed(mod.delete_infr.replace('{key}', args[0]))] });
	}
});
