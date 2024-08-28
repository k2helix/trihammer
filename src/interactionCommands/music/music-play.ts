import Command from '../../lib/structures/Command';
import play, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, YouTubeVideo } from 'play-dl';
import { Queue, queue } from '../../lib/modules/music';
import { EmbedBuilder, TextChannel } from 'discord.js';
import config from '../../../config.json';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'music-play',
	description: 'Add a song to the queue',
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand())) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		let searchString;
		if (interaction.isContextMenuCommand()) searchString = (await interaction.channel!.messages.fetch(interaction.targetId)).content;
		else searchString = interaction.options.getString('song');

		if (!searchString) return interaction.reply({ embeds: [client.redEmbed(music.invalid_song)], ephemeral: true });
		//@ts-ignore
		if (searchString === 'file' && interaction.options.getAttachment('file')) searchString = interaction.options.getAttachment('file')!.url;

		if (interaction.guild.members.me!.voice.channel && interaction.guild.members.me!.voice.channelId !== voiceChannel.id)
			return interaction.reply({ embeds: [client.redEmbed(music.wrong_vc)], ephemeral: true });

		const serverQueue = queue.get(interaction.guildId!) || new Queue({ voiceChannel: voiceChannel, textChannel: interaction.channel as TextChannel });

		if (searchString.match(/https?:\/\/.*?\.(wav|mp3|ogg|mp4).*?$/im)?.index === 0) {
			interaction.reply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${searchString}**`))], ephemeral: true });
			return serverQueue.addFileToQueue(searchString, interaction.user.id);
		}

		if (config.suno_api && searchString.startsWith('https://suno.com/song/')) {
			interaction.reply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${searchString}**`))], ephemeral: true });
			return serverQueue.addSunoSongToQueue(searchString, interaction.user.id);
		}

		let type = await play.validate(searchString);

		if (config.spotify_api)
			if (type.toString().startsWith('sp'))
				try {
					if (play.is_expired()) await play.refreshToken();
					let spot = await play.spotify(searchString);
					if (spot.type !== 'track') {
						interaction.reply({ embeds: [client.blueEmbed(music.playlists.added_to_queue)] });
						let songs = (spot as SpotifyPlaylist | SpotifyAlbum).page(1);
						if (!songs) {
							if (!serverQueue.songs[0]) serverQueue.stop();
							return interaction.reply({ embeds: [client.redEmbed(music.error_nothing_found + 'unknown')] });
						}
						for (let index = 0; index < songs.length; index++) {
							const track = songs[index];
							let searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
							if (typeof searched !== 'boolean' && searched[0]) serverQueue.handleVideo(searched[0], interaction.user.id, true);
						}
						return;
					} else {
						let searched = await play.search(`${(spot as SpotifyTrack).artists[0]?.name} ${spot.name}`, { limit: 1 }).catch((err) => {
							return client.catchError(err, interaction.channel as TextChannel);
						});
						if (typeof searched === 'boolean' || !searched || searched.length < 1) {
							if (!serverQueue.songs[0]) serverQueue.stop();
							return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
						}
						serverQueue.handleVideo((searched as YouTubeVideo[])[0], interaction.user.id);
						return interaction.reply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${searched[0].title}**`))], ephemeral: true });
					}
				} catch (err) {
					return client.catchError(err, interaction.channel as TextChannel);
				}

		if (type === 'yt_playlist') {
			const playlist = await play.playlist_info(searchString, { incomplete: true }).catch((err) => {
				return client.catchError(err, interaction.channel as TextChannel);
			});
			const videos = await playlist?.all_videos();

			if (!playlist || !videos || videos.length < 1) {
				if (!serverQueue.songs[0]) serverQueue.stop();
				return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
			}
			videos.forEach((video) => {
				serverQueue!.handleVideo(video, interaction.user.id, true);
			});
			return interaction.reply({ embeds: [client.blueEmbed(music.playlist.replace('{playlist}', playlist.title!))] });
		} else {
			let video;
			try {
				if (type === 'yt_video') video = (await play.video_info(searchString)).video_details;
				else {
					let videos = await play.search(searchString, { limit: 1 }).catch((err) => {
						return client.catchError(err, interaction.channel as TextChannel);
					});
					if (typeof videos === 'boolean' || !videos || videos.length < 1) {
						if (!serverQueue.songs[0]) serverQueue.stop();
						return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
					}
					video = videos[0];
				}
				serverQueue.handleVideo(video, interaction.user.id);
				return interaction.reply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${video.title}**`))], ephemeral: true });
			} catch (err) {
				interaction.reply({
					embeds: [new EmbedBuilder().setDescription(music.error_stream.replace('{video}', music.that_video) + `\`${(err as Error).message}\``).setColor('Red')]
				});
				client.catchError(err, interaction.channel as TextChannel, false);
			}
		}
	}
});
