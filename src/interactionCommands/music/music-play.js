const play = require('play-dl');
const { handleVideo } = require('../../modules/music');
const { MessageEmbed } = require('discord.js');
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
							.setThumbnail(spot.thumbnail.url);
						let songs = spot.page(1);
						for (let index = 0; index < songs.length; index++) {
							const track = songs[index];
							let searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
							if (typeof videos === 'boolean' || searched.length < 1) return;
							handleVideo(searched[0], message, voiceChannel, true);
						}
						return interaction.reply({ embeds: [playlistEmbed] });
					} else {
						let searched = await play.search(`${spot.artists[0]?.name} ${spot.name}`, { limit: 1 });
						if (typeof searched === 'boolean' || searched.length < 1) return interaction.reply({ content: music.not_found, ephemeral: true });
						handleVideo(searched[0], interaction, voiceChannel);
						return interaction.reply({ content: music.play.added_to_queue.description.replace('{song}', `**${searched[0].title}**`), ephemeral: true });
					}
				} catch (err) {
					console.error(err);
					return interaction.reply('An error occurred: ' + err.message);
				}
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await play.playlist_info(url, { incomplete: true });
			const videos = playlist.videos;
			videos.forEach(async (video) => {
				await handleVideo(video, interaction, voiceChannel, true);
			});

			return interaction.reply(music.playlist.replace('{playlist}', playlist.title));
		} else {
			let video = await play.search(searchString, { limit: 1 });
			if (typeof video === 'boolean' || video.length < 1) return interaction.reply({ content: music.not_found, ephemeral: true });
			handleVideo(video[0], interaction, voiceChannel);
			return interaction.reply({ content: music.play.added_to_queue.description.replace('{song}', `**${video[0].title}**`), ephemeral: true });
		}
	}
};
