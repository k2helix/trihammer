const { ModelServer } = require('../models');
const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');
const { array_move } = require('./functions');

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
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	let seek = song.seek;
	let musicC = await ModelServer.findOne({ server: serverQueue.textChannel.guild.id }).lean();
	let lang = musicC.lang;
	let { music } = require(`../lang/${lang}.js`);

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

	const dispatcher = serverQueue.connection.play(await ytdl(song.url), { seek: seek }); //type: 'opus'
	dispatcher
		.once('finish', () => {
			if (serverQueue.loop === true) {
				serverQueue.songs.push(serverQueue.songs.shift());
				serverQueue.songs[serverQueue.songs.length - 1].seek = 0;
			} else serverQueue.songs.shift();

			play(guild, serverQueue.songs[0]);
		})
		.on('error', (error) => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	if (seek > 0) return;

	var embed = new Discord.MessageEmbed()
		.setTitle(music.play.now_playing.title)
		.setDescription(`[${song.title}](${song.url})`)
		.setColor('RANDOM')
		.addField(music.play.now_playing.channel, song.channel, true)
		.addField(music.play.now_playing.duration, song.duration, true)
		.addField(music.play.now_playing.requested_by, `<@${song.requested}>`, true)
		.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	return serverQueue.textChannel.send(embed);
	// });
}

async function handleVideo(video, message, voiceChannel, playlist = false, seek) {
	const serverQueue = queue.get(message.guild.id);
	let string = '';
	for (let t of Object.values(video.duration)) {
		if (!t) continue;
		if (t < 10) t = '0' + t;
		string = string + `:${t}`;
	}

	const song = {
		id: video.id,
		title: video.title,
		duration: string.slice(1),
		durationObject: video.duration,
		channel: video.channel.title,
		url: `https://www.youtube.com/watch?v=${video.id}`,
		requested: message.author.id,
		seek: seek ? seek : 0,
		skip: []
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;

			voiceChannel.guild.me.voice.setDeaf(true).catch(() => undefined);
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`Error: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (seek) {
			array_move(serverQueue.songs, serverQueue.songs.length - 1, 1);
			serverQueue.connection.dispatcher.end();
			return;
		}
		if (playlist) return;
		else {
			let musicC = await ModelServer.findOne({
				server: serverQueue.textChannel.guild.id
			}).lean();
			let lang = musicC.lang;
			let { music } = require(`../lang/${lang}.js`);
			var embed = new Discord.MessageEmbed()
				.setTitle(music.play.added_to_queue.title)
				.setDescription(music.play.added_to_queue.description.replace('{song}', `[${song.title}](${song.url})`))
				.addField(music.play.added_to_queue.channel, song.channel, true)
				.addField(music.play.added_to_queue.duration, song.duration, true)
				.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
			return serverQueue.textChannel.send(embed);
		}
	}
	return;
}

module.exports = { play, handleVideo, queue, youtube };
