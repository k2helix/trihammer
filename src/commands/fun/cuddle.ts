import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'cuddle',
	description: '<3',
	category: 'fun',
	required_args: [{ index: 0, name: 'user', type: 'user', optional: true }],
	async execute(client, message, args, guildConf) {
		let user = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || message.member;
		const { kawaii } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get('https://nekos.life/api/v2/img/cuddle');
		let embed = new MessageEmbed();
		embed.setTitle(client.replaceEach(kawaii.cuddle, { '{author}': message.member!.displayName, '{member}': user!.displayName }));
		embed.setColor('RANDOM');
		embed.setImage((body as { url: string }).url);

		message.channel.send({ embeds: [embed] });
	}
});
