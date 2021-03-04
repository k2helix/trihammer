const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
let { get } = require('node-superfetch');
module.exports = {
	name: 'sauce',
	description: 'Get the source of an image',
	ESdesc: 'Obtén la fuente de una imagen',
	usage: 'sauce [image or url or user]',
	example: 'sauce @user\nsauce https://...',
	aliases: ['source'],
	type: 1,
	async execute(client, message, args) {
		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
		let image = user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true });
		let attachments = message.attachments.array();
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		let { body } = await get(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&numres=1&url=` + image);

		let embed = new MessageEmbed()
			.setTitle(util.sauce.title)
			.setDescription(util.sauce.looks_like(image, body.results[0]))
			.addField(util.sauce.more_source, util.sauce.search_sources(image))
			.setColor('RANDOM')

			.setImage(image);
		message.channel.send(embed);
	}
};

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
