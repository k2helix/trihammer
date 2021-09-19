const { queue } = require('../../modules/music');
const { handleVideo } = require('../../modules/music');
const { youtube } = require('../../modules/music');

module.exports = {
	name: 'seek',
	description: 'Jump to a part of the song',
	ESdesc: 'Salta a una parte de la canción',
	usage: 'seek <mm:ss>',
	example: 'seek 59\nseek 1:45',
	aliases: ['jumpto'],
	type: 6,
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const voiceChannel = interaction.member.voice.channel;
		const { music } = require(`../../utils/lang/${guildConf.lang}`);

		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });

		const array = interaction.options.getString('timestamp').split(':').reverse();

		const seconds = parseInt(array[0]);
		const minutes = parseInt(array[1]) * 60;
		// let hours = array[2] ? array[2] * 60 * 60 : 0

		let all = Math.floor(seconds + minutes /*+ Number(hours)*/);
		if (isNaN(all)) return interaction.reply({ content: 'Invalid timestamp', ephemeral: true });
		if (all === 0) all = 1;
		const url = serverQueue.songs[0].url;
		const video = await youtube.getVideo(url);
		handleVideo(video, interaction, voiceChannel, false, all);
		interaction.reply({ content: music.seek.replace('{time}', interaction.options.getString('timestamp')) });
	}
};
