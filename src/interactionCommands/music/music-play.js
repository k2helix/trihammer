const { youtube } = require('../../modules/music');
const { handleVideo } = require('../../modules/music');

module.exports = {
	name: 'music-play',
	description: 'Add a song to the queue',
	ESdesc: 'Añade una canción a la cola',
	usage: 'play <song or url>',
	example: 'play Liar Mask',
	aliases: ['p'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, interaction, guildConf) {
		const { music } = require(`../../utils/lang/${guildConf.lang}.js`);
		let message;
		if (interaction.isContextMenu()) message = await interaction.channel.messages.fetch(interaction.options.get('message').value);
		const searchString = interaction.options.getString('song') || message.content;
		if (!searchString) return interaction.reply({ content: music.invalid_song, ephemeral: true });
		const url = searchString.replace(/<(.+)>/g, '$1');

		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId !== voiceChannel.id) return interaction.reply({ content: music.wrong_vc, ephemeral: true });

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			const videoValues = Object.values(videos);
			let i = 10;
			while (i--) {
				const video = await youtube.getVideoByID(videoValues[i].id).catch(() => false);
				if (video) await handleVideo(video, interaction, voiceChannel, true);
			}

			return interaction.reply(music.playlist.replace('{playlist}', playlist.title));
		} else {
			// eslint-disable-next-line no-redeclare
			var video = await youtube.getVideo(url).catch(async () => {
				const videos = await youtube.searchVideos(searchString, 1).catch((error) => console.log(error));
				if (typeof videos === 'boolean' || videos.length < 1) return false;
				return videos[0];
			});

			if (!video) return interaction.reply({ content: music.not_found, ephemeral: true });
			const currentVideo = await youtube.getVideoByID(video.id);

			handleVideo(currentVideo, interaction, voiceChannel);
			return interaction.reply({ content: music.play.added_to_queue.description.replace('{song}', `**${video.title}**`), ephemeral: true });
		}
	}
};
