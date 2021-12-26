const { ModelServer } = require('../utils/models');
const playdl = require('play-dl');
const Discord = require('discord.js');
const { array_move } = require('../utils/functions');

// eslint-disable-next-line no-unused-vars
const { StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
// const prism = require('prism-media');
function swap(array, x, y) {
	var b = array[x];
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

const queue = new Map();

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.connection?.destroy();
		queue.delete(guild.id);
	}

	let musicC = await ModelServer.findOne({ server: serverQueue.textChannel.guild.id }).lean();
	let lang = musicC.lang;
	let { music } = require(`../utils/lang/${lang}.js`);

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
	let source;
	try {
		if (song.seek !== 0) source = await playdl.stream(song.url, { seek: song.seek, seekMode: 'precise' });
		else source = await playdl.stream(song.url);
	} catch (err) {
		console.log('Tried with play-dl, got error ' + err.message);
		return serverQueue.textChannel.send('An error ocurred while executing this command (is the video age restricted?): ' + err.message);
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
		serverQueue.audioPlayer = player;
		player.on('stateChange', (oldState, newState) => {
			if (oldState.status == 'playing' && newState.status == 'idle') {
				if (serverQueue.loop === true) {
					serverQueue.songs.push(serverQueue.songs.shift());
					serverQueue.songs[serverQueue.songs.length - 1].seek = 0;
				} else serverQueue.songs.shift();
				if (!serverQueue.songs[0]) {
					serverQueue.connection.destroy();
					return queue.delete(serverQueue.textChannel.guild.id);
				}
				if (serverQueue.shuffle) serverQueue.songs = swap(serverQueue.songs, 0, Math.floor(Math.random() * serverQueue.songs.length));
				play(guild, serverQueue.songs[0]);
			}
		});
		serverQueue.connection.subscribe(player);
		serverQueue.audioPlayer.state.resource.volume.setVolumeLogarithmic(serverQueue.volume / 5);
	} catch (error) {
		console.error(error);
		return serverQueue.textChannel.send('An error ocurred when executing this command: ' + error.message);
	}

	if (song.seek > 0) return;

	var embed = new Discord.MessageEmbed()
		.setTitle(music.play.now_playing.title)
		.setDescription(`[${song.title}](${song.url})`)
		.setColor('RANDOM')
		.addField(music.play.now_playing.channel, song.channel, true)
		.addField(music.play.now_playing.duration, song.duration || 'Unknown', true)
		.addField(music.play.now_playing.requested_by, `<@${song.requested}>`, true)
		.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	return serverQueue.textChannel.send({ embeds: [embed] });
	// });
}

async function handleVideo(video, message, voiceChannel, playlist = false, seek) {
	// if (message.options) message.type = 'interaction';
	const serverQueue = queue.get(message.guildId);
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

	const song = {
		id: video.id,
		title: video.title,
		duration: video.durationRaw,
		durationInSec: video.durationInSec,
		channel: video.channel.name,
		url: `https://www.youtube.com/watch?v=${video.id}`,
		requested: message.user?.id || message.author.id,
		seek: seek ? seek : 0,
		skip: []
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			audioPlayer: null,
			songs: [],
			volume: 1,
			playing: true,
			loop: false,
			shuffle: false,
			leaveTimeout: null
		};
		queue.set(message.guildId, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: message.guildId,
				adapterCreator: message.guild.voiceAdapterCreator
			});
			queueConstruct.connection = connection;

			voiceChannel.guild.me.voice.setDeaf(true).catch(() => undefined);
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guildId);
			return message.channel.send(`Error: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		let musicC = await ModelServer.findOne({
			server: serverQueue.textChannel.guild.id
		}).lean();
		let lang = musicC.lang;
		let { music } = require(`../utils/lang/${lang}.js`);
		if (seek) {
			if (song.seek > song.durationInSec) return serverQueue.textChannel.send(music.seek_cancelled);
			array_move(serverQueue.songs, serverQueue.songs.length - 1, 1);
			serverQueue.audioPlayer.stop();
			return;
		}
		if (playlist) return;
		var embed = new Discord.MessageEmbed()
			.setTitle(music.play.added_to_queue.title)
			.setDescription(music.play.added_to_queue.description.replace('{song}', `[${song.title}](${song.url})`))
			.addField(music.play.added_to_queue.channel, song.channel, true)
			.addField(music.play.added_to_queue.duration, song.duration || 'Unknown', true)
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
		return serverQueue.textChannel.send({ embeds: [embed] });
	}
	return;
}

module.exports = { play, handleVideo, queue };

//https://discord.com/channels/222078108977594368/852128888128929802/881447711352684585
