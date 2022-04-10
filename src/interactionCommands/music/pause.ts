const { queue } = require('../../lib/modules/music');
module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	ESdesc: 'Pausa la canción actual',
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (serverQueue && serverQueue.playing && !serverQueue.leaveTimeout) {
			serverQueue.playing = false;
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.pause();
			return interaction.reply({ content: '⏸' });
		}
		return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
	}
};
