import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelRank } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'addlevel',
	description: "Set someone's level to the specified",
	aliases: ['setlevel'],
	required_args: [
		{ index: 0, name: 'user', type: 'member' },
		{ index: 1, name: 'level', type: 'number' }
	],
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	category: 'social',
	async execute(client, message, args, guildConf) {
		const { xp } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let user =
			message.mentions.members!.first() ||
			message.guild!.members.cache.find((m) => m.user.tag === args.slice(0, args.length - 1).join(' ')) ||
			message.guild!.members.cache.get(args[0]);

		let level = args[args.length - 1];
		if (!user) return;
		if (user.user.bot) return;

		if (!level) return;
		if (level.startsWith('-')) return;

		let local = await ModelRank.findOne({ id: user.id, server: message.guild!.id });
		if (!local) {
			let newRankModel = new ModelRank({
				id: user.id,
				server: message.guild!.id,
				level: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		local.level = parseInt(level);
		await local.save();
		message.channel.send({ embeds: [client.blueEmbed(client.replaceEach(xp.level_set, { '{user}': user.user.tag, '{level}': parseInt(level).toString() }))] });
	}
});
