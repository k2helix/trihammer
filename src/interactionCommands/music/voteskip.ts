const { queue } = require('../../lib/modules/music');
module.exports = {
	name: 'voteskip',
	description: 'Skip a song',
	ESdesc: 'Salta una canción',
	aliases: ['skip'],
	type: 6,
	execute(client, interaction, guildConf) {
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });

		const serverQueue = queue.get(interaction.guildId);
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		const members = interaction.member.voice.channel.members.filter((m) => !m.user.bot).size,
			required = Math.floor(members / 2),
			skips = serverQueue.songs[0].skip;
		if (skips.length >= required) {
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return interaction.reply({ content: music.skip.skipping });
		}
		// eslint-disable-next-line prettier/prettier
		if (skips.includes(interaction.user.id)) return interaction.reply({ content: music.skip.already_voted.replace('{votes}', `${skips.length}/${required}`), ephemeral: true });

		skips.push(interaction.user.id);
		if (skips.length >= required) {
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return interaction.reply({ content: music.skip.skipping });
		} else return interaction.reply({ content: music.skip.voting.replace('{votes}', `${skips.length}/${required}`), ephemeral: true });
	}
};
