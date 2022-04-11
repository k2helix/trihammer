import { Queue, Song } from '../structures/interfaces/MusicInterfaces';
import { ModelServer, Server } from '../utils/models';
import { SoundCloudStream, YouTubeStream, YouTubeVideo, stream, video_info } from 'play-dl';
import { Guild, Interaction, Message, MessageEmbed, TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { array_move } from '../utils/functions';
import { DiscordGatewayAdapterCreator, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import LanguageFile from '../structures/interfaces/LanguageFile';
// const prism = require('prism-media');

function swap<T>(array: T[], x: number, y: number) {
	const b = array[x];
	array[x] = array[y];
	array[y] = b;
	return array;
}
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
	if (serverQueue.textChannel.type === 'DM') return;

	if (!song) {
		getVoiceConnection(serverQueue.voiceChannel.guildId)?.destroy();
		queue.delete(guild.id);
	}

	const musicC: Server = await ModelServer.findOne({ server: serverQueue.textChannel.guild.id }).lean();
	const lang = musicC.lang;
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
		if (song.seek !== 0) source = await stream(song.url, { seek: song.seek });
		else source = await stream(song.url);
	} catch (error) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		console.log('Tried with play-dl, got error ' + error.message);
		console.error(error);
		return serverQueue.textChannel.send('An error ocurred while executing this command (is the video age restricted?): ' + error.message);
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
		player.on<'stateChange'>('stateChange', async (oldState, newState) => {
			if (oldState.status == 'playing' && newState.status == 'idle') {
				if (serverQueue.autoplay)
					if (serverQueue.songs.length == 1) {
						let relatedVideos = (await video_info(serverQueue.songs[0].url)).related_videos;
						let firstVid = (await video_info(relatedVideos[0])).video_details;
						let i = 0;
						// if the first recommendation of recommended video by youtube is the one that just ended, get another until this stops happening;
						do firstVid = (await video_info(relatedVideos[i++])).video_details;
						while ((await video_info(firstVid.url)).related_videos[0] === serverQueue.songs[0].url);
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
					// @ts-ignore
					serverQueue.songs.push(serverQueue.songs.shift());
					serverQueue.songs[serverQueue.songs.length - 1].seek = 0;
				} else serverQueue.songs.shift();
				if (!serverQueue.songs[0])
					serverQueue.leaveTimeout = setTimeout(() => {
						getVoiceConnection(serverQueue.voiceChannel.guildId)!.destroy();
						return queue.delete(serverQueue.voiceChannel.guildId);
					}, 30000);
				else {
					if (serverQueue.shuffle) serverQueue.songs = swap(serverQueue.songs, 0, Math.floor(Math.random() * serverQueue.songs.length));
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

	if (song.seek > 0) return;

	const embed = new MessageEmbed()
		.setTitle(music.play.now_playing.title)
		.setDescription(`**[${song.title}](${song.url})**\n[${song.channel!.name}](${song.channel!.url})`)
		.addField(music.play.now_playing.requested_by, `${song.requested === 'Autoplay' ? 'Autoplay' : `<@${song.requested}>`}`, true)
		.addField(music.play.now_playing.duration, song.duration || 'Unknown', true)
		.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	return serverQueue.textChannel.send({ embeds: [embed] });
	// });
}

async function handleVideo(video: YouTubeVideo, message: Message | Interaction, voiceChannel: VoiceBasedChannel, playlist = false, seek: number) {
	// if (message.options) message.type = 'interaction';
	if (message.channel!.type === 'DM') return;
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
		seek: seek ? seek : 0,
		skip: []
	};
	if (!serverQueue) {
		const queueConstruct: Queue = {
			textChannel: message.channel! as TextBasedChannel,
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
		if (serverQueue.textChannel.type === 'DM') return;
		serverQueue.songs.push(song);
		const musicC: Server = await ModelServer.findOne({
			server: serverQueue.textChannel.guild.id
		}).lean();
		const lang = musicC.lang;
		const { music } = (await import(`../utils/lang/${lang}`)) as LanguageFile;
		if (seek) {
			if (song.seek > Number(song.durationInSec)) return serverQueue.textChannel.send(music.seek_cancelled);
			array_move(serverQueue.songs, serverQueue.songs.length - 1, 1);
			// @ts-ignore
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return;
		}
		if (serverQueue.leaveTimeout) {
			clearTimeout(serverQueue.leaveTimeout);
			serverQueue.leaveTimeout = null;
			if (!playlist) return play(serverQueue.textChannel.guild, song);
			else play(serverQueue.textChannel.guild, serverQueue.songs[0]);
		}
		if (playlist) return;
		const embed = new MessageEmbed()
			.setTitle(music.play.added_to_queue.title)
			.setDescription(`**[${song.title}](${song.url})**\n[${song.channel!.name}](${song.channel!.url})`)
			.addField(music.play.added_to_queue.duration, song.duration || 'Unknown', true)
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
		return serverQueue.textChannel.send({ embeds: [embed] });
	}
	return;
}

export { play, handleVideo, queue };

//https://discord.com/channels/222078108977594368/852128888128929802/881447711352684585
