const { queue } = require('../../modules/music');
module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	ESdesc: 'Pausa la canción actual',
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../utils/lang/${guildConf.lang}`);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.audioPlayer.pause();
			return interaction.reply({ content: '⏸' });
		}
		return interaction.reply({ content: music.no_queue, ephemeral: true });
	}
};
