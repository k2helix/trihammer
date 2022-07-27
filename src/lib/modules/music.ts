import { Queue, Song } from '../structures/interfaces/MusicInterfaces';
import { ModelServer, Server } from '../utils/models';
import { SoundCloudStream, YouTubeStream, YouTubeVideo, stream, video_info } from 'play-dl';
import { BaseGuildTextChannel, EmbedBuilder, Guild, Interaction, Message, VoiceBasedChannel } from 'discord.js';
import { compareTwoStrings } from '../utils/functions';
import { DiscordGatewayAdapterCreator, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import LanguageFile from '../structures/interfaces/LanguageFile';

// const prism = require('prism-media');

// function swap<T>(array: T[], x: number, y: number) {
// 	const b = array[x];
// 	array[x] = array[y];
// 	array[y] = b;
// 	return array;
// }
// var googleTTS = require('google-tts-api');
// const https = require('https');

// let { PassThrough } = require('stream');
// let FFmpeg = require('fluent-ffmpeg');

// const concatStreams = (streamArray, streamCounter = streamArray.length) =>
// 	streamArray.reduce((mergedStream, stream) => {
// 		mergedStream = stream.pipe(mergedStream, { end: false });
// 		stream.once('end', () => --streamCounter === 0 && mergedStream.emit('end'));
// 		return mergedStream;
// 	}, new PassThrough());

const queue: Map<string, Queue> = new Map();

async function play(guild: Guild, song: Song) {
	const serverQueue = queue.get(guild.id);
	if (!serverQueue) return;

	if (!song) {
		getVoiceConnection(serverQueue.voiceChannel.guildId)?.destroy();
		return queue.delete(guild.id);
	}

	const guildConfig: Server = await ModelServer.findOne({ server: serverQueue.textChannel.guild.id }).lean();
	const lang = guildConfig.lang;
	const { music } = (await import(`../utils/lang/${lang}`)) as LanguageFile;

	// let url = await googleTTS(music.play.now_playing.tts + ` ${song.title}`, lang, 1); // speed normal = 1 (default), slow = 0.24
	// https.get(url, function (response) {
	// 	let ytStream = new PassThrough();
	// 	let ttsStream = new PassThrough();

	// let opt = {
	// 	videoFormat: 'mp4',
	// 	quality: 'lowest',
	// 	audioFormat: 'mp3',
	// 	filter(format) {
	// 		return format.container === opt.videoFormat && format.audioBitrate;
	// 	}
	// };
	// // let ytdlStream = ytdl(song.url); //await

	// const ffmpeg = new FFmpeg(ytdlStream);
	// ytStream = ffmpeg.format('mp3').pipe(ytStream);

	// response.pipe(ttsStream);

	// let stream = concatStreams([ttsStream, ytStream]);
	let source: YouTubeStream | SoundCloudStream;
	try {
		source = await stream(song.url, { seek: song.seek || 0 });
	} catch (error) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		Promise.reject(error); //cannot call client.catchError here, so handle it with the unhandledRejection event in the index file

		serverQueue.textChannel.send({
			embeds: [new EmbedBuilder().setDescription(music.error_stream.replace('{video}', serverQueue.songs[0].title) + `\`${error.message}\``).setColor('Red')]
		});
		serverQueue.songs.shift(); // skip to next song
		if (!serverQueue.songs[0]) {
			if (!serverQueue.leaveTimeout)
				serverQueue.leaveTimeout = setTimeout(() => {
					getVoiceConnection(serverQueue.voiceChannel.guildId)!.destroy();
					return queue.delete(serverQueue.voiceChannel.guildId);
				}, 30000);
		} else {
			if (serverQueue.shuffle && serverQueue.songs[0].seek === 0)
				serverQueue.songs.splice(0, 0, serverQueue.songs.splice(Math.floor(Math.random() * serverQueue.songs.length), 1)[0]);
			play(guild, serverQueue.songs[0]);
		}
		return;
	}
	try {
		// let currentType = StreamType.Arbitrary;
		// if (song.seek !== 0) {
		// 	const FFMPEG_ARGUMENTS = ['-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2'];
		// 	let hhmmss = new Date(song.seek * 1000).toISOString().slice(11, 19);
		// 	let seekStream = new prism.FFmpeg({
		// 		args: ['-ss', hhmmss, ...FFMPEG_ARGUMENTS]
		// 	});
		// 	currentType = StreamType.Raw;
		// 	stream = stream.pipe(seekStream);
		// }
		if (!source?.stream) return serverQueue.textChannel.send('An error ocurred when getting the stream');
		const resource = createAudioResource(source.stream, { inputType: source.type, inlineVolume: true });
		const player = createAudioPlayer();
		player.play(resource);
		player.on('stateChange', async (oldState, newState) => {
			if (oldState.status == 'playing' && newState.status == 'idle') {
				if (serverQueue.autoplay)
					if (serverQueue.songs.length == 1) {
						let relatedVideos = (await video_info(serverQueue.songs[0].url)).related_videos;
						let firstVid = (await video_info(relatedVideos[0])).video_details;
						let i = 0;
						// if the first recommendation of recommended video by youtube is the one that just ended or the video title is very similar or the recommended video is a lot longer than the current one, get another until this stops happening;
						do firstVid = (await video_info(relatedVideos[i++])).video_details;
						while (
							(await video_info(firstVid.url)).related_videos[0] === serverQueue.songs[0].url ||
							compareTwoStrings(serverQueue.songs[0].title.toLowerCase(), firstVid.title!.toLowerCase()) > 0.8 ||
							firstVid.durationInSec - serverQueue.songs[0].durationInSec > 3000
						);
						serverQueue.songs.push({
							id: firstVid.id!,
							title: firstVid.title!,
							duration: firstVid.durationRaw,
							durationInSec: firstVid.durationInSec,
							channel: {
								url: firstVid.channel!.url!,
								name: firstVid.channel!.name!
							},
							url: `https://www.youtube.com/watch?v=${firstVid.id}`,
							requested: 'Autoplay',
							seek: 0,
							skip: []
						});
					}

				if (serverQueue.loop) {
					serverQueue.songs.push(serverQueue.songs.shift()!);
					serverQueue.songs[serverQueue.songs.length - 1].seek = 0;
				} else serverQueue.songs.shift();
				if (!serverQueue.songs[0]) {
					if (!serverQueue.leaveTimeout)
						serverQueue.leaveTimeout = setTimeout(() => {
							getVoiceConnection(serverQueue.voiceChannel.guildId)!.destroy();
							return queue.delete(serverQueue.voiceChannel.guildId);
						}, 30000);
				} else {
					if (serverQueue.shuffle && serverQueue.songs[0].seek === 0)
						serverQueue.songs.splice(0, 0, serverQueue.songs.splice(Math.floor(Math.random() * serverQueue.songs.length), 1)[0]); //swap(serverQueue.songs, 0, Math.floor(Math.random() * serverQueue.songs.length)); // change the song that is gonna be played with a random song
					play(guild, serverQueue.songs[0]);
				}
			}
		});
		getVoiceConnection(serverQueue.voiceChannel.guildId)!.subscribe(player);
		// @ts-ignore
		getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.state.resource.volume.setVolumeLogarithmic(serverQueue.volume / 5);
	} catch (error) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		console.error(error);
		return serverQueue.textChannel.send('An error ocurred when executing this command: ' + error.message);
	}

	if (!song.seek) {
		const embed = new EmbedBuilder()
			.setTitle(music.play.now_playing.title)
			.setDescription(`**[${song.title}](${song.url})**\n[${song.channel!.name}](${song.channel!.url})`)
			.setColor(4494843)
			.addFields(
				{ name: music.play.now_playing.requested_by, value: `${song.requested === 'Autoplay' ? 'Autoplay' : `<@${song.requested}>`}`, inline: true },
				{ name: music.play.now_playing.duration, value: song.duration || 'Unknown', inline: true }
			)
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
		return serverQueue.textChannel.send({ embeds: [embed] });
	}
	// });
}

async function handleVideo(video: YouTubeVideo, message: Message | Interaction, voiceChannel: VoiceBasedChannel, playlist = false) {
	const serverQueue = queue.get(message.guildId!);
	// function humanize(object) {
	// 	let arr = [];
	// 	let keys = Object.keys(object);
	// 	keys.forEach((key) => {
	// 		let index = keys.indexOf(key);
	// 		let value = object[key];
	// 		if (key !== 'minutes' && !value && index !== keys.length - 1 && !keys.some((v) => keys.indexOf(v) < index && object[v])) return;
	// 		if (value < 10) value = '0' + value;
	// 		arr.push(value.toString());
	// 	});
	// 	return arr.join(':');
	// }
	const song: Song = {
		id: video.id!,
		title: video.title!,
		duration: video.durationRaw,
		durationInSec: video.durationInSec,
		channel: {
			url: video.channel!.url!,
			name: video.channel!.name!
		},
		url: `https://www.youtube.com/watch?v=${video.id}`,
		requested: message instanceof Message ? message.author.id : message.user.id,
		seek: 0,
		skip: []
	};
	if (!serverQueue) {
		const queueConstruct: Queue = {
			textChannel: message.channel! as BaseGuildTextChannel,
			voiceChannel: voiceChannel,
			songs: [],
			volume: 1,
			playing: true,
			loop: false,
			shuffle: false,
			autoplay: false,
			leaveTimeout: null
		};
		queue.set(message.guildId!, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: message.guild!.id,
				adapterCreator: message.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator,
				selfDeaf: true
			});

			play(message.guild!, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guildId!);
			return message.channel!.send(`Error: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		const guildConfig: Server = await ModelServer.findOne({
			server: serverQueue.textChannel.guild.id
		}).lean();
		const lang = guildConfig.lang;
		const { music } = (await import(`../utils/lang/${lang}`)) as LanguageFile;
		if (serverQueue.leaveTimeout) {
			clearTimeout(serverQueue.leaveTimeout);
			serverQueue.leaveTimeout = null;
			if (!playlist) return play(serverQueue.textChannel.guild, song);
			return play(serverQueue.textChannel.guild, playlist ? serverQueue.songs[0] : song);
		}
		if (!playlist) {
			const embed = new EmbedBuilder()
				.setTitle(music.play.added_to_queue.title)
				.setDescription(`**[${song.title}](${song.url})**\n[${song.channel!.name}](${song.channel!.url})`)
				.addFields({ name: music.play.added_to_queue.duration, value: song.duration || 'Unknown', inline: true })
				.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
			return serverQueue.textChannel.send({ embeds: [embed] });
		}
	}
	return;
}

export { play, handleVideo, queue };

//https://discord.com/channels/222078108977594368/852128888128929802/881447711352684585
