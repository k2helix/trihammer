const { queue } = require('../../lib/modules/music');
const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'skip',
	description: 'Skip a song',
	ESdesc: 'Salta una canción',
	aliases: ['skip'],
	type: 6,
	async execute(client, message) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
				const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!message.member.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue || serverQueue?.leaveTimeout) return;

		const djRole = message.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
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
