const { queue } = require('../../modules/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'queueremove',
	description: 'Remove a song from the queue',
	ESdesc: 'Borra una canción de la cola',
	usage: 'queueremove <song>',
	example: 'queueremove 2',
	aliases: ['qremove', 'songremove', 'remove', 'deletesong'],
	type: 6,
	async execute(client, message, args) {
		const serverQueue = queue.get(message.guild.id);
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return await message.channel.send(music.no_vc);
		if (!serverQueue) return await message.channel.send(music.no_queue);
		if (!args[0]) return message.channel.send(music.need_qnumber);
		if (isNaN(args[0])) return await message.channel.send(music.need_qnumber);
		if (args[0] === '1') return await message.channel.send(music.cannot_remove);

		const index = parseInt(args[0]) - 1;
		const song = serverQueue.songs[index];
		if (!song) return await message.channel.send(music.song_404);

		const djRole = message.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');

		if (djRole && !message.member.roles.cache.has(djRole.id) && message.member.id !== serverQueue.songs[index].requested) return message.channel.send(music.need_dj.remove);

		await message.channel.send(music.song_removed.replace('{song}', serverQueue.songs[Math.floor(args[0] - 1)].title));
		serverQueue.songs.splice(index, 1);
	}
};
