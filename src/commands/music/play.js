/* eslint-disable no-case-declarations */
const play = require('play-dl');

const { ModelServer } = require('../../utils/models');
const { handleVideo } = require('../../modules/music');
const { MessageEmbed } = require('discord.js');

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
		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;

		const { music } = require(`../../utils/lang/${langcode}.js`);

		const searchString = args.join(' ');
		if (!searchString) return message.channel.send({ content: music.invalid_song });
		const url = searchString.replace(/<(.+)>/g, '$1');

		if (!voiceChannel) return message.channel.send({ content: music.no_vc });
		if (message.guild.me.voice.channel && message.guild.me.voice.channelId !== voiceChannel.id) return message.channel.send({ content: music.wrong_vc });
		if (require('../../../config.json').spotify_api)
			if (searchString.toLowerCase().includes('spotify'))
				try {
					if (play.is_expired()) await play.refreshToken();
					let spot = await play.spotify(searchString);
					if (spot.type !== 'track') {
						let playlistEmbed = new MessageEmbed()
							.setTitle(music.play.added_to_queue.title)
							.setDescription(
								music.playlists.added_to_queue.replaceAll({
									'{name}': `[${spot.name}](${spot.url})`,
									'{owner}': spot.owner.name
								})
							)
							.setColor('RANDOM')
							.setThumbnail(spot.thumbnail.url);
						let songs = spot.page(1);
						for (let index = 0; index < songs.length; index++) {
							const track = songs[index];
							let searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
							if (typeof videos === 'boolean' || searched.length < 1) return;
							handleVideo(searched[0], message, voiceChannel, true);
						}
						return message.channel.send({ embeds: [playlistEmbed] });
					} else {
						let searched = await play.search(`${spot.artists[0]?.name} ${spot.name}`, { limit: 1 });
						if (typeof searched === 'boolean' || searched.length < 1) return message.channel.send({ content: music.not_found, ephemeral: true });
						return handleVideo(searched[0], message, voiceChannel);
					}
				} catch (err) {
					console.error(err);
					return message.channel.send('An error occurred: ' + err.message);
				}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await play.playlist_info(url, { incomplete: true });
			const videos = playlist.videos;
			videos.forEach(async (video) => {
				await handleVideo(video, message, voiceChannel, true);
			});

			return message.channel.send(music.playlist.replace('{playlist}', playlist.title));
		} else {
			let video = await play.search(searchString, { limit: 1 });
			if (typeof video === 'boolean' || video.length < 1) return message.channel.send({ content: music.not_found, ephemeral: true });
			handleVideo(video[0], message, voiceChannel);
		}
	}
};
