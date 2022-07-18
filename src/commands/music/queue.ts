import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'queue',
	description: 'View the currently queued songs',
	aliases: ['q'],
	category: 'music',
	required_args: [{ index: 0, type: 'number', name: 'page', optional: true }],
	async execute(client, message, args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		let page = parseInt(args[0]) || 1,
			amplifiedEnd = page * 10,
			amplifiedPage = (page - 1) * 10;
		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
		if (!selectedPortion || selectedPortion.length < 1) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder().setCustomId('voteskip').setEmoji({ id: '882675796341321798' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('loop').setEmoji({ id: '882674902304448582' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('shuffle').setEmoji({ id: '923956906006052914' }).setStyle(ButtonStyle.Primary),
			// new ButtonBuilder().setCustomId('volume-down').setEmoji({ id: '882677475350564945' }).setStyle(ButtonStyle.Primary),
			// new ButtonBuilder().setCustomId('volume-up').setEmoji({ id: '882677486553530429' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('stop').setEmoji({ id: '882674312094568528' }).setStyle(ButtonStyle.Danger),
			new ButtonBuilder().setCustomId('crossx').setEmoji({ id: '882639143874723932' }).setStyle(ButtonStyle.Secondary)
		]);

		const embed = new EmbedBuilder()
			.setTitle(music.queue_songs)
			.setColor('White')
			.setDescription(
				`${selectedPortion.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) \`${song.duration}\``).join('\n')}`
			)
			.setFooter({ text: client.replaceEach(music.queue_page, { '{number}': page.toString(), '{total}': (Math.floor(serverQueue.songs.length / 10) + 1).toString() }) })
			.setTimestamp();

		let msg = await message.channel.send({ embeds: [embed], components: [row] });

		const collector = msg.createMessageComponentCollector({ time: 60000, componentType: ComponentType.Button });
		// @ts-ignore
		collector.on('collect', (reaction: ButtonInteraction) => {
			if (reaction.customId === 'crossx')
				if (reaction.user.id !== message.author.id) return;
				else return reaction.update({ components: [] });

			client.interactionCommands.get(reaction.customId)!.execute(client, reaction, guildConf);
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
});
