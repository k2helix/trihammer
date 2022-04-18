import { MessageEmbed } from 'discord.js';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { Result } from '../../lib/structures/interfaces/SaucenaoInterfaces';
export default new MessageCommand({
	name: 'sauce',
	description: 'Get the source of an image',
	aliases: ['source'],
	category: 'utility',
	required_args: [{ index: 0, name: 'image', type: 'string', optional: true }],
	async execute(client, message, args, guildConf) {
		let image = message.author.displayAvatarURL({ size: 1024, format: 'png' });
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);

		if (user) image = user.displayAvatarURL({ format: 'png', size: 1024 });
		if (args[0] && args[0].startsWith('http')) image = args[0];
		if ([...message.attachments.values()][0]) image = [...message.attachments.values()][0].url;

		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let { body } = await request.get(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&numres=1&url=` + image);

		let embed = new MessageEmbed()
			.setTitle(util.sauce.title)
			.setDescription(util.sauce.looks_like((body as { results: Result[] }).results[0]))
			.addField(util.sauce.more_source, util.sauce.search_sources(image))
			.setColor('RANDOM')

			.setImage(image);
		message.channel.send({ embeds: [embed] });
	}
});

// x = {
// 	results: [
// 		{
// 			header: {
// 				similarity: '95.12',
// 				thumbnail: 'https://img1.saucenao.com/res/pixiv/8061/80611223_p0_master1200.jpg?auth=sItGwnRq1jrXuugPAieORQ\u0026exp=1612296000',
// 				index_id: 5,
// 				index_name: 'Index #5: Pixiv Images - 80611223_p0_master1200.jpg',
// 				dupes: 0
// 			},
// 			data: {
// 				ext_urls: ['https://www.pixiv.net/member_illust.php?mode=medium\u0026illust_id=80611223'],
// 				title: '\u30ec\u30e0',
// 				pixiv_id: 80611223,
// 				member_name: '\u3042\u3044\u3056\u3068',
// 				member_id: 20943384
// 			}
// 		}
// 	]
// };
