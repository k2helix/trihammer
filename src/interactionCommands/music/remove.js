const { queue } = require('../../modules/music');
module.exports = {
	name: 'remove',
	description: 'Remove a song from the queue',
	ESdesc: 'Borra una canción de la cola',
	usage: 'queueremove <song>',
	example: 'queueremove 2',
	aliases: ['qremove', 'songremove', 'remove', 'deletesong'],
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../utils/lang/${guildConf.lang}`);
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });
		let id = interaction.options.getString('id');
		if (isNaN(id)) return interaction.reply({ content: music.need_qnumber, ephemeral: true });
		if (id === '1') return interaction.reply({ content: music.cannot_remove, ephemeral: true });

		const index = parseInt(id) - 1;
		const song = serverQueue.songs[index];
		if (!song) return interaction.reply({ content: music.song_404, ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name === 'DJ');

		if (djRole && !interaction.member.roles.cache.has(djRole.id)) return interaction.reply({ content: music.need_dj.remove, ephemeral: true });
		if (interaction.member.id !== serverQueue.songs[index].requested) return interaction.reply({ content: music.need_dj.remove, ephemeral: true });

		interaction.reply(music.song_removed.replace('{song}', serverQueue.songs[Math.floor(id - 1)].title));
		serverQueue.songs.splice(index, 1);
	}
};
