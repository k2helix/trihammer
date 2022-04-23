import { TextChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'cleanuser',
	description: 'Deletes the last x messages of the given user',
	aliases: ['userclean', 'clean', 'clean-user'],
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'amount', type: 'number', optional: true }
	],
	required_perms: ['MANAGE_MESSAGES'],
	required_roles: ['MODERATOR'],
	client_perms: ['MANAGE_MESSAGES'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const user = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;
		let amount = parseInt(args[1]) || 100;

		message.channel.messages
			.fetch({
				limit: amount > 100 ? 100 : amount
			})
			.then((list) => {
				let messageCollection = list.filter((m) => m.author.id === user.id && Date.now() - 1123200000 < m.createdTimestamp);
				let messages = [...messageCollection.values()].slice(0, amount);
				if (!messages || !messages[1]) return message.channel.send({ embeds: [client.redEmbed(mod.bulkDelete_14d)] });
				(message.channel as TextChannel).bulkDelete(messages).catch((error) => {
					client.catchError(error, message.channel as TextChannel);
				});
			});
		message.delete();
	}
});
