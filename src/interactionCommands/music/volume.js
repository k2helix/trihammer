const { queue } = require('../../modules/music');
module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	ESdesc: 'Establece el volumen a x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../utils/lang/${guildConf.lang}`);

		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });

		let newVolume = interaction.options.getString('value');
		if (!newVolume) return interaction.reply({ content: `Volume: **${serverQueue.volume}**.`, ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name === 'DJ');
		if (djRole && !interaction.member.roles.cache.has(djRole.id)) return interaction.reply({ content: music.need_dj.volume, ephemeral: true });

		if (parseFloat(newVolume) > 10) return interaction.reply({ content: 'No.', ephemeral: true });

		serverQueue.volume = parseFloat(newVolume);
		serverQueue.audioPlayer.state.resource.volume.setVolumeLogarithmic(parseFloat(newVolume) / 5);
		interaction.reply(`New volume: ${newVolume}`);
	}
};