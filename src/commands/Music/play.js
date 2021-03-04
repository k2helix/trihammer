const { youtube } = require('../../utils/methods/music');

const { ModelServer } = require('../../utils/models');
const { handleVideo } = require('../../utils/methods/music');

module.exports = {
	name: 'play',
	description: 'Add a song to the queue',
	ESdesc: 'Añade una canción a la cola',
	usage: 'play <song or url>',
	example: 'play Liar Mask',
	aliases: ['p'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, message, args) {
		const searchString = args.slice(0).join(' ');
		const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';

		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;

		const { music } = require(`../../utils/lang/${langcode}.js`);

		if (!voiceChannel) return message.channel.send(music.no_vc);

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			const videoValues = Object.values(videos);
			let i = 10;
			while (i--) {
				const video = await youtube.getVideoByID(videoValues[i].id).catch(() => false);
				if (video) await handleVideo(video, message, voiceChannel, true);
			}

			return message.channel.send(music.playlist.replace('{playlist}', playlist.title));
		} else {
			// eslint-disable-next-line no-redeclare
			var video = await youtube.getVideo(url).catch(async () => {
				const videos = await youtube.searchVideos(searchString, 1).catch(() => false);
				if (typeof videos === 'boolean' || videos.length < 1) return false;
				return videos[0];
			});

			if (!video) return message.channel.send(music.not_found);
			const currentVideo = await youtube.getVideoByID(video.id);

			return handleVideo(currentVideo, message, voiceChannel);
		}
	}
};
