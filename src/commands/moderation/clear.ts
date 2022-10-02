import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'clear',
	description: "Clear the current channel messages'",
	category: 'moderation',
	required_args: [{ index: 0, name: 'amount', type: 'number', optional: true }],
	required_perms: ['ManageMessages'],
	required_roles: ['MODERATOR'],
	client_perms: ['ManageMessages'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let amount = parseInt(args[0]) || 50;
		message.channel.bulkDelete(amount, true).catch(() => {
			return message.channel.send({ embeds: [client.redEmbed(mod.bulkDelete_14d)] });
		});
	}
});
