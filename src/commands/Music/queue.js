const { MessageEmbed } = require('discord.js');
const { queue } = require('../../utils/methods/music');
const { ModelServer } = require('../../utils/models');

module.exports = {
	name: 'queue',
	description: 'Get the queue',
	ESdesc: 'Mira la cola',
	usage: 'queue <page>',
	example: 'queue 0',
	aliases: ['q'],
	type: 6,
	async execute(client, message, args) {
		const serverQueue = queue.get(message.guild.id);
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);
		if (!serverQueue) return await message.channel.send(music.no_queue);

		let pageNumber = args[0] > 0 ? args[0] : 1;

		const page = parseInt(pageNumber) || 1,
			amplifiedEnd = page * 10;
		let amplifiedPage = (page - 1) * 10;
		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
		if (!selectedPortion || selectedPortion.length < 1) return await message.channel.send(music.no_queue);

		const embed = new MessageEmbed()
			.setTitle(music.queue_songs)
			.setColor('RANDOM')
			.setDescription(
				`${selectedPortion
					.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`)
					.join('\n')}\n ${music.now_playing}\n${serverQueue.songs[0].title} - [${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${
					serverQueue.songs[0].id
				})`
			)
			.setFooter(music.queue_page.replaceAll({ '{number}': page, '{total}': Math.floor(serverQueue.songs.length / 10) + 1 }))
			.setTimestamp();
		return await message.channel.send(embed);
	}
};
