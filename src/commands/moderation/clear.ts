import { TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'clear',
	description: "Clear the current channel messages'",
	category: 'moderation',
	required_args: [{ index: 0, name: 'amount', type: 'number', optional: true }],
	required_perms: ['MANAGE_MESSAGES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_MESSAGES'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let amount = parseInt(args[0]) || 50;
		message.channel.messages
			.fetch({ limit: amount > 100 ? 100 : amount })
			.then(function (list) {
				let messageCollection = list.filter((m) => Date.now() - 1123200000 < m.createdTimestamp);
				let messages = [...messageCollection.values()].slice(0, amount);
				if (!messages || !messages[1]) return message.channel.send({ embeds: [client.redEmbed(mod.bulkDelete_14d)] });
				(message.channel as TextChannel).bulkDelete(messages);
			})
			.catch(function (err) {
				client.catchError(err, message.channel as TextChannel);
			});
	}
});
