// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('megadb');
const reset = new db.crearDB('reset');
import request from 'node-superfetch';
import config from '../../../config.json';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'rep',
	description: 'Give a reputation point to a member',
	category: 'social',
	required_args: [{ index: 0, name: 'user', type: 'member', optional: true }],
	async execute(client, message, args, guildConf) {
		let user = message.mentions.members!.first()! || message.guild!.members.cache.get(args[0])!;

		const { xp } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let author = await ModelUsers.findOne({ id: message.author.id });
		if (config['top.gg'])
			if (args[0] && args[0] === 'reset') {
				let hasVoted = (await reset.has(message.author.id)) ? await reset.get(message.author.id) : false;
				if (hasVoted) return message.channel.send({ embeds: [client.blueEmbed(xp.rep.no_reset)] });
				try {
					let { body } = await request.get({
						url: `https://top.gg/api/bots/${client.user!.id}/check?userId=` + message.author.id,
						headers: {
							'Content-Type': 'application/json',
							authorization: 'Bearer ' + process.env.DBL_API_KEY
						}
					});
					if ((body as { voted: number }).voted > 0) {
						author.repcooldown = 0;
						author.save();
						reset.set(message.author.id, true);
						return message.channel.send({ embeds: [client.blueEmbed(xp.rep.reset)] });
					} else return message.channel.send({ embeds: [client.blueEmbed(xp.rep.no_reset)] });
				} catch (err) {
					message.channel.send((err as Error).message);
				}
			}

		if (!user || user?.user.bot) return message.channel.send({ embeds: [client.redEmbed(xp.rep.user)] });
		let given = await ModelUsers.findOne({ id: user.id });
		if (author.repcooldown > Date.now()) return message.channel.send({ embeds: [client.redEmbed(xp.rep.cooldown(author.repcooldown - Date.now(), guildConf.prefix))] });
		else {
			author.repcooldown = Date.now() + 43200000;
			if (user.id === message.author.id) return message.channel.send(':thinking:');
			given.rep = given.rep + 1;
			await author.save();
			await given.save();

			let obj = {
				'{author}': message.author.username,
				'{user}': user.user.username
			};
			message.channel.send({ embeds: [client.lightBlueEmbed(client.replaceEach(xp.rep.added, obj))] });
		}
	}
});
