import play, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, YouTubePlayList, YouTubeVideo } from 'play-dl2';
import config from '../../../config.json';
import { Queue, queue } from '../../lib/modules/music';
import { EmbedBuilder, TextChannel } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new MessageCommand({
	name: 'play',
	description: 'Add a song to the queue',
	aliases: ['p'],
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	required_args: [{ index: 0, type: 'string', name: 'query', optional: true }],
	async execute(client, message, args, guildConf) {
		if (!message.guild || !message.member) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		const searchString = args.join(' ') || message.attachments.first()?.url;
		if (!searchString) return message.channel.send({ embeds: [client.redEmbed(music.invalid_song)] });

		if (message.guild.members.me!.voice.channel && message.guild.members.me!.voice.channelId !== voiceChannel.id)
			return message.channel.send({ embeds: [client.redEmbed(music.wrong_vc)] });

		const serverQueue = queue.get(message.guild.id) || new Queue({ voiceChannel: voiceChannel, textChannel: message.channel as TextChannel });

		if (searchString.match(/https?:\/\/.*?\.(wav|mp3|ogg|mp4).*?$/im)?.index === 0) return serverQueue.addFileToQueue(searchString, message.author.id);

		let type = await play.validate(searchString);

		if (config.spotify_api)
			if (type.toString().startsWith('sp'))
				try {
					if (play.is_expired()) await play.refreshToken();
					let spot = await play.spotify(searchString);
					if (spot.type !== 'track') {
						message.channel.send({ embeds: [client.blueEmbed(music.playlists.added_to_queue)] });
						let songs = (spot as SpotifyPlaylist | SpotifyAlbum).page(1);
						if (!songs) {
							if (!serverQueue.songs[0]) serverQueue.stop();
							return message.channel.send({ embeds: [client.redEmbed(music.error_nothing_found + 'unknown')] });
						}
						for (let index = 0; index < songs.length; index++) {
							const track = songs[index];
							let searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
							if (typeof searched !== 'boolean' && searched[0]) serverQueue.handleVideo(searched[0], message.author.id, true);
						}
						return;
					} else {
						let searched = (await play.search(`${(spot as SpotifyTrack).artists[0]?.name} ${spot.name}`, { limit: 1 }).catch((err) => {
							return client.catchError(err, message.channel as TextChannel);
						})) as YouTubeVideo[];
						if (typeof searched === 'boolean' || searched.length < 1) {
							if (!serverQueue.songs[0]) serverQueue.stop();
							return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });
						}
						return serverQueue.handleVideo((searched as YouTubeVideo[])[0], message.author.id);
					}
				} catch (err) {
					return client.catchError(err, message.channel as TextChannel);
				}

		if (type === 'yt_playlist') {
			const playlist = (await play.playlist_info(searchString, { incomplete: true }).catch((err) => {
				return client.catchError(err, message.channel as TextChannel);
			})) as YouTubePlayList;
			const videos = await playlist.all_videos();
			videos.forEach(async (video) => {
				await serverQueue!.handleVideo(video, message.author.id, true);
			});
			return message.channel.send({ embeds: [client.blueEmbed(music.playlist.replace('{playlist}', playlist.title!))] });
		} else {
			let video;
			try {
				if (type === 'yt_video') video = (await play.video_info(searchString)).video_details;
				else {
					let videos = (await play.search(searchString, { limit: 1 }).catch((err) => {
						return client.catchError(err, message.channel as TextChannel);
					})) as YouTubeVideo[];
					if (typeof videos === 'boolean' || videos?.length < 1) {
						if (!serverQueue.songs[0]) serverQueue.stop();
						return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });
					}
					video = (await play.video_info((videos as YouTubeVideo[])[0].id!)).video_details;
				}
				serverQueue.handleVideo(video, message.author.id);
			} catch (err) {
				message.channel.send({
					embeds: [new EmbedBuilder().setDescription(music.error_stream.replace('{video}', music.that_video) + `\`${(err as Error).message}\``).setColor('Red')]
				});
				client.catchError(err, message.channel as TextChannel, false);
			}
		}
	}
});
