const { MessageEmbed } = require('discord.js');
let { get } = require('node-superfetch');
module.exports = {
	name: 'sauce',
	description: 'Get the source of an image',
	ESdesc: 'Obtén la fuente de una imagen',
	usage: 'sauce [image or url or user]',
	example: 'sauce @user\nsauce https://...',
	aliases: ['source'],
	type: 1,
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../lib/utils/lang/${guildConf.lang}`);
		let user = interaction.options.getUser('user-avatar') || interaction.user;
		let image = user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true });

		// let attachments = [...interaction.message.attachments.values()];
		// if (attachments[0]) image = attachments[0].url;

		if (user.id === interaction.user.id && interaction.options.getString('image')) image = interaction.options.getString('image');
		if (interaction.isContextMenu()) {
			let message = await interaction.channel.messages.fetch(interaction.options.get('message').value);
			if (message.embeds[0])
				if (message.embeds[0].type === 'image') image = message.embeds[0].url;
				else if (message.embeds[0].image) image = message.embeds[0].image.url;
				else if (message.embeds[0].thumbnail) image = message.embeds[0].thumbnail.url;
			let attachments = [...message.attachments.values()];
			if (attachments[0]) image = attachments[0].url;
			if (image === user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true }))
				return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });
		}
		if (!image.startsWith('http')) return interaction.reply({ content: util.anime.screenshot.no_image, ephemeral: true });

		let { body } = await get(`https://saucenao.com/search.php?api_key=${process.env.SAUCENAO_API_KEY}&output_type=2&numres=1&url=` + image);

		let embed = new MessageEmbed()
			.setTitle(util.sauce.title)
			.setDescription(util.sauce.looks_like(body.results[0]))
			.addField(util.sauce.more_source, util.sauce.search_sources(image))
			.setColor('RANDOM')

			.setImage(image);
		interaction.reply({ embeds: [embed], ephemeral: interaction.isContextMenu() });
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
