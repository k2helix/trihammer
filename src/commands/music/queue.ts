const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { queue } = require('../../lib/modules/music');
const { ModelServer } = require('../../lib/utils/models');

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
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
				const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!serverQueue || serverQueue?.leaveTimeout) return await message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		let pageNumber = args[0] > 0 ? args[0] : 1;

		const page = parseInt(pageNumber) || 1,
			amplifiedEnd = page * 10;
		let amplifiedPage = (page - 1) * 10;
		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
		if (!selectedPortion || selectedPortion.length < 1) return await message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		const row = new MessageActionRow().addComponents([
			new MessageButton().setCustomId('voteskip').setEmoji('882675796341321798').setStyle('PRIMARY'),
			new MessageButton().setCustomId('loop').setEmoji('882674902304448582').setStyle('PRIMARY'),
			new MessageButton().setCustomId('shuffle').setEmoji('923956906006052914').setStyle('PRIMARY'),
			// new MessageButton().setCustomId('volume-down').setEmoji('882677475350564945').setStyle('PRIMARY'),
			// new MessageButton().setCustomId('volume-up').setEmoji('882677486553530429').setStyle('PRIMARY'),
			new MessageButton().setCustomId('stop').setEmoji('882674312094568528').setStyle('DANGER'),
			new MessageButton().setCustomId('crossx').setEmoji('882639143874723932').setStyle('SECONDARY')
		]);

		const embed = new MessageEmbed()
			.setTitle(music.queue_songs)
			.setColor('RANDOM')
			.setDescription(
				`${selectedPortion.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`).join('\n')}\n ${
					music.now_playing
				}\n${serverQueue.songs[0].title} - [${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`
			)
			.setFooter({ text: music.queue_page.replaceAll({ '{number}': page, '{total}': Math.floor(serverQueue.songs.length / 10) + 1 }) })
			.setTimestamp();
		if (serverQueue.shuffle) embed.addField('Shuffle', music.shuffle.enabled);
		if (serverQueue.loop) embed.addField('Loop', music.loop.enabled);

		let msg = await message.channel.send({ embeds: [embed], components: [row] });

		const collector = msg.createMessageComponentCollector({ time: 60000 });
		collector.on('collect', (reaction) => {
			if (reaction.customId === 'crossx')
				if (reaction.user.id !== message.author.id) return;
				else return reaction.update({ components: [] });

			client.interactionCommands.get(reaction.customId).execute(client, reaction, serverConfig);
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
};
