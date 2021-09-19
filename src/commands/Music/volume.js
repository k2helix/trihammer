const { queue } = require('../../modules/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	ESdesc: 'Establece el volumen a x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	type: 6,
	async execute(client, message, args) {
		const serverQueue = queue.get(message.guild.id);
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);

		if (!message.member.voice.channel) return await message.channel.send(music.no_vc);

		if (!serverQueue) return await message.channel.send(music.no_queue);
		if (!args[1] || args[0] !== 'set') return await message.channel.send(`Volume: **${serverQueue.volume}**.`);

		const djRole = message.guild.roles.cache.find((role) => role.name === 'DJ');

		if (djRole && !message.member.roles.cache.has(djRole.id)) return message.channel.send(music.need_dj.volume);

		if (parseFloat(args[1]) > 10) return message.channel.send('NO');

		serverQueue.volume = args[1];
		serverQueue.audioPlayer.state.resource.volume.setVolumeLogarithmic(args[1] / 5);
	}
};
