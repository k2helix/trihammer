const { queue } = require('../../lib/modules/music');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'forceskip',
	description: 'Skip a song',
	ESdesc: 'Salta una canción',
	aliases: ['fs'],
	type: 6,
	execute(client, interaction, guildConf) {
		const { music, xp } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });

		const serverQueue = queue.get(interaction.guildId);
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission =
			interaction.member.roles.cache.has(djRole?.id) ||
			interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
			interaction.member.id === serverQueue.songs[0].requested;
		if (permission) {
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return interaction.reply(music.skip.skipping);
		} else return interaction.reply(xp.no_perms);
	}
};
