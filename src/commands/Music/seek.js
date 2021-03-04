const { queue } = require('../../utils/methods/music');
const { handleVideo } = require('../../utils/methods/music');
const { youtube } = require('../../utils/methods/music');

module.exports = {
	name: 'seek',
	description: 'Jump to a part of the song',
	ESdesc: 'Salta a una parte de la canción',
	usage: 'seek <mm:ss>',
	example: 'seek 59\nseek 1:45',
	aliases: ['jumpto'],
	type: 6,
	async execute(client, message, args) {
		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue) return;
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return;

		const array = args.join(' ').split(':').reverse();

		const seconds = parseInt(array[0]) || 0;
		const minutes = parseInt(array[1]) * 60 || 0;
		// let hours = array[2] ? array[2] * 60 * 60 : 0

		const all = Math.floor(seconds + minutes /*+ Number(hours)*/);
		const url = serverQueue.songs[0].url;
		const video = await youtube.getVideo(url);
		handleVideo(video, message, voiceChannel, false, all);
	}
};
