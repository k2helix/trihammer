const { queue } = require('../../modules/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'stop',
	description: 'Make the bot leaves the voice channel',
	ESdesc: 'Haz que el bot salga del canal de voz',
	aliases: ['st'],
	type: 6,
	async execute(client, message) {
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);

		if (!voiceChannel) return await message.channel.send(music.no_vc);
		if (!serverQueue) return await message.channel.send(music.no_queue);

		const djRole = message.guild.roles.cache.find((role) => role.name === 'DJ');

		if (djRole && !message.member.roles.cache.has(djRole.id) && message.member.id !== serverQueue.songs[0].requested) return message.channel.send(music.need_dj.stop);

		serverQueue.songs = [];
		serverQueue.connection.destroy();
		queue.delete(message.guild.id);
	}
};
