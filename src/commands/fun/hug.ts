import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'hug',
	description: '🤗',
	category: 'fun',
	required_args: [{ index: 0, name: 'user', type: 'member', optional: true }],
	async execute(client, message, args, guildConf) {
		let user = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || message.member;
		const { kawaii } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get('https://nekos.life/api/v2/img/hug');
		let embed = new EmbedBuilder();
		embed.setTitle(client.replaceEach(kawaii.hug, { '{author}': message.member!.displayName, '{member}': user!.displayName }));
		embed.setColor('Random');
		embed.setImage((body as { url: string }).url);

		message.channel.send({ embeds: [embed] });
	}
});
