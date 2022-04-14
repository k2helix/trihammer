/* eslint-disable no-case-declarations */
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'queue',
	description: 'Add, remove or view the songs in the current queue',
	category: 'music',
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.isCommand()) return interaction.reply({ embeds: [client.redEmbed('Hmph, that was not supposed to happen, try again...')], ephemeral: true });

		if (interaction.options.data[0].name === 'view') {
			if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
			let pageNumber = parseInt(interaction.options.get('page')?.value as string) || 0;

			const page = pageNumber || 1,
				amplifiedEnd = page * 10;
			let amplifiedPage = (page - 1) * 10;
			const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
			if (!selectedPortion || selectedPortion.length < 1) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

			const row = new MessageActionRow().addComponents([
				new MessageButton().setCustomId('voteskip').setEmoji('882675796341321798').setStyle('PRIMARY'),
				new MessageButton().setCustomId('loop').setEmoji('882674902304448582').setStyle('PRIMARY'),
				new MessageButton().setCustomId('shuffle').setEmoji('923956906006052914').setStyle('PRIMARY'),
				// new MessageButton().setCustomId('volume-down').setEmoji('882677475350564945').setStyle('PRIMARY'),
				// new MessageButton().setCustomId('volume-up').setEmoji('882677486553530429').setStyle('PRIMARY'),
				new MessageButton().setCustomId('stop').setEmoji('882674312094568528').setStyle('DANGER'),
				new MessageButton().setCustomId('crossx').setEmoji('882639143874723932').setStyle('SECONDARY')
			]);
			const view_embed = new MessageEmbed()
				.setTitle(music.queue_songs)
				.setDescription(
					`${selectedPortion.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) \`${song.duration}\``).join('\n')}`
				)
				.setColor('WHITE')
				.setFooter({ text: client.replaceEach(music.queue_page, { '{number}': page.toString(), '{total}': (Math.floor(serverQueue.songs.length / 10) + 1).toString() }) })
				.setTimestamp();

			interaction.reply({ embeds: [view_embed], components: [row] });
			let msg = (await interaction.fetchReply()) as Message<boolean>;
			const collector = msg.createMessageComponentCollector({ time: 60000 });
			collector.on('collect', (reaction) => {
				if (reaction.customId === 'crossx')
					if (reaction.user.id !== interaction.user.id) return;
					else return reaction.update({ components: [] });

				client.interactionCommands.get(reaction.customId)!.execute(client, reaction as ButtonInteraction, guildConf);
			});
			collector.on('end', () => {
				msg.edit({ components: [] });
			});
		} else {
			let currentSongOpt = { view: 'np', seek: 'seek', pause: 'pause', resume: 'resume' };
			let optName = interaction.options.data[0].options ? (interaction.options.data[0].options[0]?.name as 'seek' | 'view' | 'pause' | 'resume') : null;
			const names = {
				'current-song': optName ? currentSongOpt[optName] : null,
				add: interaction.options.getBoolean('confirm-result') ? 'music-search' : 'music-play',
				remove: 'remove',
				voteskip: 'voteskip',
				forceskip: 'forceskip',
				stop: 'stop',
				loop: 'loop',
				autoplay: 'autoplay',
				shuffle: 'shuffle',
				volume: 'volume'
			};
			//@ts-ignore
			client.interactionCommands.get(names[interaction.options.data[0].name]).execute(client, interaction, guildConf);
		}
	}
});

// switch (interaction.options.data[0].name) {
// 	case 'view':
// 		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
// 		let pageNumber = parseInt(interaction.options.get('page')?.value) || 0;

// 		const page = parseInt(pageNumber) || 1,
// 			amplifiedEnd = page * 10;
// 		let amplifiedPage = (page - 1) * 10;
// 		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
// 		if (!selectedPortion || selectedPortion.length < 1) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

// 		const view_embed = new MessageEmbed()
// 			.setTitle(music.queue_songs)
// 			.setColor('RANDOM')
// 			.setDescription(
// 				`${selectedPortion
// 					.map((song) => `**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`)
// 					.join('\n')}\n ${music.now_playing}\n${serverQueue.songs[0].title} - [${
// 					serverQueue.songs[0].duration
// 				}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`
// 			)
// 			.setFooter(music.queue_page.replaceAll({ '{number}': page, '{total}': Math.floor(serverQueue.songs.length / 10) + 1 }))
// 			.setTimestamp();
// 		await interaction.reply({ embeds: [view_embed] });
// 		break;
// 	case 'current-song':
// 		let equivalent = { view: 'np', seek: 'seek', pause: 'pause', resume: 'resume' };
// 		client.interactionCommands.get(equivalent[interaction.options.data[0].options[0].name]).execute(client, interaction, guildConf);
// 		break;
// 	case 'add':
// 		if (interaction.options.getBoolean('confirm-result'))
// 			return client.interactionCommands.get('music-search').execute(client, interaction, guildConf);
// 		client.interactionCommands.get('music-play').execute(client, interaction, guildConf);
// 		break;
// 	case 'remove':
// 		client.interactionCommands.get('remove').execute(client, interaction, guildConf);
// 		break;
// 	case 'skip':
// 		client.interactionCommands.get('skip').execute(client, interaction, guildConf);
// 		break;
// 	case 'stop':
// 		client.interactionCommands.get('stop').execute(client, interaction, guildConf);
// 		break;
// 	case 'loop':
// 		client.interactionCommands.get('loop').execute(client, interaction, guildConf);
// 		break;
// 	case 'volume':
// 		client.interactionCommands.get('volume').execute(client, interaction, guildConf);
// 		break;
// }
