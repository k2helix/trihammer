const { queue } = require('../../modules/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'shuffle',
	description: 'Put the queue in shuffle mode',
	ESdesc: 'Pon la cola en modo aleatorio',
	usage: 'shuffle',
	example: 'shuffle',
	aliases: ['l'],
	type: 6,
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const serverQueue = queue.get(message.guild.id);
		const { music } = require(`../../utils/lang/${langcode}`);

		if (!message.member.voice.channel) return await message.channel.send(music.no_vc);
		if (!serverQueue) return await message.channel.send(music.no_queue);
		serverQueue.shuffle = !serverQueue.shuffle;
		// queue.set(message.guild.id, serverQueue);
		if (serverQueue.shuffle) return await message.channel.send(music.shuffle.enabled);
		else return await message.channel.send(music.shuffle.disabled);
	}
};
