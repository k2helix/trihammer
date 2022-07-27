import Command from '../../lib/structures/Command';
import play, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, YouTubeVideo } from 'play-dl';
import { handleVideo } from '../../lib/modules/music';
import { EmbedBuilder, Interaction, TextChannel } from 'discord.js';
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
		if (interaction.isContextMenuCommand()) searchString = (await interaction.channel!.messages.fetch(interaction.options.get('message')!.value! as string)).content;
		else searchString = interaction.options.getString('song');
		if (!searchString) return interaction.reply({ embeds: [client.redEmbed(music.invalid_song)], ephemeral: true });

		let type = await play.validate(searchString);

		if (interaction.guild.members.me!.voice.channel && interaction.guild.members.me!.voice.channelId !== voiceChannel.id)
			return interaction.reply({ embeds: [client.redEmbed(music.wrong_vc)], ephemeral: true });
		if (config.spotify_api)
			if (type.toString().startsWith('sp'))
				try {
					if (play.is_expired()) await play.refreshToken();
					let spot = await play.spotify(searchString);
					if (spot.type !== 'track') {
						interaction.reply({ embeds: [client.blueEmbed(music.playlists.added_to_queue)] });
						let songs = (spot as SpotifyPlaylist | SpotifyAlbum).page(1);
						if (!songs) return interaction.reply({ embeds: [client.redEmbed(music.error_nothing_found + 'unknown')] });
						for (let index = 0; index < songs.length; index++) {
							const track = songs[index];
							let searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
							if (typeof searched !== 'boolean' && searched[0]) handleVideo(searched[0], interaction as Interaction, voiceChannel, true, 0);
						}
						return;
					} else {
						let searched = (await play.search(`${(spot as SpotifyTrack).artists[0]?.name} ${spot.name}`, { limit: 1 }).catch((err) => {
							return client.catchError(err, interaction.channel as TextChannel);
						})) as YouTubeVideo[];
						if (typeof searched === 'boolean' || searched.length < 1) return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
						handleVideo((searched as YouTubeVideo[])[0], interaction as Interaction, voiceChannel, false, 0);
						return interaction.reply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${searched[0].title}**`))], ephemeral: true });
					}
				} catch (err) {
					return client.catchError(err, interaction.channel as TextChannel);
				}

		if (type === 'yt_playlist') {
			const playlist = await play.playlist_info(searchString, { incomplete: true });
			const videos = await playlist.all_videos();
			videos.forEach(async (video) => {
				await handleVideo(video, interaction as Interaction, voiceChannel, true, 0);
			});
			return interaction.reply({ embeds: [client.blueEmbed(music.playlist.replace('{playlist}', playlist.title!))] });
		} else {
			let video;
			try {
				if (type === 'yt_video') video = (await play.video_info(searchString)).video_details;
				else {
					let videos = (await play.search(searchString, { limit: 1 }).catch((err) => {
						return client.catchError(err, interaction.channel as TextChannel);
					})) as YouTubeVideo[];
					if (typeof videos === 'boolean' || videos?.length < 1) return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
					video = (await play.video_info((videos as YouTubeVideo[])[0].id!)).video_details;
				}
				handleVideo(video, interaction as Interaction, voiceChannel, false, 0);
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
