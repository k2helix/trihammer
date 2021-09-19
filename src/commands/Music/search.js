const { youtube } = require('../../modules/music');

const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
const { handleVideo } = require('../../modules/music');

module.exports = {
	name: 'search',
	description: 'Search a song',
	ESdesc: 'Busca una canción',
	usage: 'search <song or url>',
	example: 'search paradisus paradoxum',
	aliases: ['sc'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, message, args) {
		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);

		const searchString = args.slice(0).join(' ');
		if (!voiceChannel) return await message.channel.send(music.no_vc);

		const videos = await youtube.searchVideos(searchString, 10).catch(() => false);
		if (typeof videos === 'boolean' || videos.length < 1) return await message.channel.send(music.not_found);

		let songIndex = 0;
		const embed = new MessageEmbed()
			.setTitle(music.song_select)
			.setColor('#1423aa')
			.setFooter(music.cancel_select)
			.setDescription(`${videos.map((video2) => `**${++songIndex} -** [${video2.title}](${video2.url})`).join('\n')} \n${music.type_a_number}`)
			.setTimestamp();
		await message.channel.send({ embeds: [embed] });

		let filter = (msg) => msg.author.id === message.author.id;
		const response = await message.channel
			.awaitMessages({
				filter,
				max: 1,
				time: 20000,
				errors: ['time']
			})
			.catch(() => false);

		if (typeof response === 'boolean') return await message.channel.send(music.cancel);
		else if (response.first().content === 'cancel') return await message.channel.send('Ok');
		else if (isNaN(response.first().content)) return await message.channel.send(music.must_be_number);
		else if (response.first().content < 1 || response.first().content > 10) return await message.channel.send(music.must_be_number);

		const videoIndex = parseInt(response.first().content);
		const video = videos[videoIndex - 1];
		const actualVideo = await youtube.getVideoByID(video.id);

		return await handleVideo(actualVideo, message, voiceChannel);
	}
};
