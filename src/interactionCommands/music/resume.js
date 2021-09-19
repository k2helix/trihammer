const { queue } = require('../../modules/music');
module.exports = {
	name: 'resume',
	description: 'Resume the current song',
	ESdesc: 'Quita la pausa de la canción actual',
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../utils/lang/${guildConf.lang}`);
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.audioPlayer.unpause();
			return interaction.reply({ content: '▶', ephemeral: true });
		}
		return interaction.reply({ content: music.no_queue, ephemeral: true });
	}
};
