const { queue } = require('../../modules/music');
module.exports = {
	name: 'stop',
	description: 'Make the bot leaves the voice channel',
	ESdesc: 'Haz que el bot salga del canal de voz',
	aliases: ['st'],
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const voiceChannel = interaction.member.voice.channel;
		const { music } = require(`../../utils/lang/${guildConf.lang}`);

		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		if (djRole && !interaction.member.roles.cache.has(djRole.id)) return interaction.reply({ content: music.need_dj.stop, ephemeral: true });
		const members = interaction.member.voice.channel.members.filter((m) => !m.user.bot).size;
		// eslint-disable-next-line curly
		if (members > 2) {
			if (djRole && !interaction.member.roles.cache.has(djRole.id)) return interaction.reply({ content: music.need_dj.stop, ephemeral: true });
		}

		serverQueue.songs = [];
		serverQueue.connection.destroy();
		if (serverQueue.leaveTimeout) clearTimeout(serverQueue.leaveTimeout);
		queue.delete(interaction.guildId);
		interaction.reply('See you next time!');
	}
};
