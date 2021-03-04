const { queue } = require('../../utils/methods/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	ESdesc: 'Pausa la canción actual',
	type: 6,
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const serverQueue = queue.get(message.guild.id);
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸');
		}
		return message.channel.send(music.no_queue);
	}
};
