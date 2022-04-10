const { queue } = require('../../lib/modules/music');
const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	ESdesc: 'Establece el volumen a x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	cooldown: 3,
	type: 6,
	async execute(client, message, args) {
		const serverQueue = queue.get(message.guild.id);
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
				const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!message.member.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		if (!serverQueue || serverQueue?.leaveTimeout) return await message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		if (!args[0]) return await message.channel.send(`Volume: **${serverQueue.volume}**.`);

		const djRole = message.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		if (djRole && !message.member.roles.cache.has(djRole.id)) return message.channel.send(music.need_dj.volume);

		if (parseFloat(args[0]) > 5) return message.channel.send('NO');

		serverQueue.volume = args[0];
		serverQueue.audioPlayer.state.resource.volume.setVolumeLogarithmic(args[0] / 5);
	}
};
