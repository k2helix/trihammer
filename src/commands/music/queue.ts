import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'queue',
	description: 'View the currently queued songs',
	aliases: ['q'],
	category: 'music',
	async execute(client, message, args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		let page = parseInt(args[0]) || 1,
			amplifiedEnd = page * 10,
			amplifiedPage = (page - 1) * 10;
		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
		if (!selectedPortion || selectedPortion.length < 1) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
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
			.setColor('WHITE')
			.setDescription(
				`${selectedPortion.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) \`${song.duration}\``).join('\n')}`
			)
			.setFooter({ text: client.replaceEach(music.queue_page, { '{number}': page.toString(), '{total}': (Math.floor(serverQueue.songs.length / 10) + 1).toString() }) })
			.setTimestamp();

		let msg = await message.channel.send({ embeds: [embed], components: [row] });

		const collector = msg.createMessageComponentCollector({ time: 60000 });
		collector.on('collect', (reaction) => {
			if (reaction.customId === 'crossx')
				if (reaction.user.id !== message.author.id) return;
				else return reaction.update({ components: [] });

			client.interactionCommands.get(reaction.customId)!.execute(client, reaction as ButtonInteraction, guildConf);
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
});
