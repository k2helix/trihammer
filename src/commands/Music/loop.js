const { queue } = require('../../utils/methods/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'loop',
	description: 'Put the queue in loop',
	ESdesc: 'Pon la cola en loop',
	usage: 'loop',
	example: 'loop',
	aliases: ['l'],
	type: 6,
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const serverQueue = queue.get(message.guild.id);
		const { music } = require(`../../utils/lang/${langcode}`);

		if (!message.member.voice.channel) return await message.channel.send(music.no_vc);
		if (!serverQueue) return await message.channel.send(music.no_queue);
		serverQueue.loop = !serverQueue.loop;
		queue.set(message.guild.id, serverQueue);
		if (serverQueue.loop) return await message.channel.send(music.loop.enabled);
		else return await message.channel.send(music.loop.disabled);
	}
};
