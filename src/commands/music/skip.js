const { queue } = require('../../modules/music');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'skip',
	description: 'Skip a song',
	ESdesc: 'Salta una canción',
	aliases: ['skip'],
	type: 6,
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);
		if (!message.member.voice.channel) return await message.channel.send(music.no_vc);

		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue) return;

		const djRole = message.guild.roles.cache.find((role) => role.name === 'DJ');
		if (djRole && message.member.roles.cache.has(djRole.id)) return serverQueue.audioPlayer.stop();

		const members = message.member.voice.channel.members.filter((m) => !m.user.bot).size,
			required = Math.floor(members / 2),
			skips = serverQueue.songs[0].skip;
		if (skips.length >= required) {
			serverQueue.audioPlayer.stop();
			return message.channel.send({ content: music.skip.skipping });
		}
		if (skips.includes(message.author.id)) return message.channel.send(music.skip.already_voted.replace('{votes}', `${skips.length}/${required}`));

		skips.push(message.author.id);
		if (skips.length >= required) {
			serverQueue.audioPlayer.stop();
			return await message.channel.send(music.skip.skipping);
		} else return await message.channel.send(music.skip.voting.replace('{votes}', `${skips.length}/${required}`));
	}
};
