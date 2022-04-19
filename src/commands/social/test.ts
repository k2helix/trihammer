/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// var googleTTS = require('google-tts-api');
// const https = require('https');
// const ytdl = require('ytdl-core');

import MessageCommand from '../../lib/structures/MessageCommand';

// let { PassThrough } = require('stream');
// let FFmpeg = require('fluent-ffmpeg');

// const concatStreams = (streamArray, streamCounter = streamArray.length) =>
// 	streamArray.reduce((mergedStream, stream) => {
// 		// pipe each stream of the array into the merged stream
// 		// prevent the automated 'end' event from firing
// 		mergedStream = stream.pipe(mergedStream, { end: false });
// 		// rewrite the 'end' event handler
// 		// Every time one of the stream ends, the counter is decremented.
// 		// Once the counter reaches 0, the mergedstream can emit its 'end' event.
// 		stream.once('end', () => --streamCounter === 0 && mergedStream.emit('end'));
// 		return mergedStream;
// 	}, new PassThrough());

export default new MessageCommand({
	name: 'test',
	description: 'test',
	category: 'unknown',
	execute(client, message, args) {
		if (message.author.id !== '461279654158925825') return;

		// googleTTS(args.join(' '), 'en', 1) // speed normal = 1 (default), slow = 0.24
		// 	.then(function (url) {
		// 		https.get(url, async function (response) {
		// 			let ytStream = new PassThrough();
		// 			let ttsStream = new PassThrough();

		// 			let opt = {
		// 				videoFormat: 'mp4',
		// 				quality: 'lowest',
		// 				audioFormat: 'mp3',
		// 				filter(format) {
		// 					return format.container === opt.videoFormat && format.audioBitrate;
		// 				}
		// 			};
		// 			let ytdlStream = ytdl('https://www.youtube.com/watch?v=zOWJqNPeifU', opt);

		// 			const ffmpeg = new FFmpeg(ytdlStream);
		// 			ytStream = ffmpeg.format('mp3').pipe(ytStream);

		// 			response.pipe(ttsStream);

		// 			var mergedStreams = concatStreams([ttsStream, ytStream]);

		// 			let connection = await message.member.voice.channel.join();
		// 			let dispatcher = connection.play(mergedStreams);
		// 			dispatcher.once('finish', () => {
		// 				message.member.voice.channel.leave();
		// 			});
		// 		});
		// 	})
		// 	.catch(function (err) {
		// 		console.error(err);
		// 	});
	}
});
