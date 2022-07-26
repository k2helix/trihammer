import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'poke',
	description: '👉',
	category: 'fun',
	required_args: [{ index: 0, name: 'user', type: 'user', optional: true }],
	async execute(client, message, args, guildConf) {
		let user = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || message.member;
		const { kawaii } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get({ url: 'https://api.nekos.dev/api/v3/images/sfw/gif/poke/' });
		let embed = new EmbedBuilder();
		embed.setTitle(client.replaceEach(kawaii.poke, { '{author}': message.member!.displayName, '{member}': user!.displayName }));
		embed.setColor('Random');
		embed.setImage((body as { data: { response: { url: string } } }).data.response.url);

		message.channel.send({ embeds: [embed] });
	}
});
