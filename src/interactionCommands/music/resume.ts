const { queue } = require('../../lib/modules/music');
module.exports = {
	name: 'resume',
	description: 'Resume the current song',
	ESdesc: 'Quita la pausa de la canción actual',
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (serverQueue && !serverQueue.playing && !serverQueue.leaveTimeout) {
			serverQueue.playing = true;
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.unpause();
			return interaction.reply({ content: '▶', ephemeral: true });
		}
		return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
	}
};