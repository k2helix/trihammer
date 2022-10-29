import { ActionRowBuilder, ComponentType, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction, TextChannel } from 'discord.js';
import { Queue, queue } from '../../lib/modules/music';
import play, { YouTubeVideo } from 'play-dl2';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'music-search',
	description: 'Search a song',
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;
		const { music, util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const searchString = interaction.options.getString('song')!;
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (interaction.guild.members.me!.voice.channel && interaction.guild.members.me!.voice.channelId !== voiceChannel.id)
			return interaction.reply({ embeds: [client.redEmbed(music.wrong_vc)], ephemeral: true });

		const serverQueue = queue.get(interaction.guildId!) || new Queue({ voiceChannel: voiceChannel, textChannel: interaction.channel as TextChannel });

		const videos = (await play.search(searchString, { limit: 10 }).catch((err) => {
			return client.catchError(err, interaction.channel as TextChannel);
		})) as YouTubeVideo[];
		if (typeof videos === 'boolean' || videos?.length < 1) {
			if (!serverQueue.songs[0]) serverQueue.stop();
			return interaction.reply({ embeds: [client.redEmbed(music.not_found)], ephemeral: true });
		}

		interaction.deferReply();

		let options = [];
		for (let index = 0; index < videos.length; index++) {
			const element = videos[index];
			options.push({ label: `${index + 1}- ${element.title}`.slice(0, 99), value: index.toString() });
		}
		const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
			new SelectMenuBuilder().setCustomId('music-search').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
		);

		let songIndex = 0;
		const embed = new EmbedBuilder()
			.setTitle(music.song_select)
			.setColor('#1423aa')
			.setFooter({ text: music.cancel_select })
			.setDescription(`${videos.map((v) => `**${++songIndex} -** [${v.title}](${v.url}) - ${v.durationRaw}`).join('\n')} \n${music.type_a_number}`)
			.setTimestamp();
		let msg = await interaction.channel!.send({ embeds: [embed], components: [row] });
		const filter = (int: SelectMenuInteraction) => int.customId === 'music-search' && int.user.id === interaction.user.id;
		let selected;
		try {
			selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
			msg.delete();
		} catch (error) {
			if (interaction.replied || interaction.deferred) interaction.editReply({ embeds: [client.redEmbed(music.cancel)] });
			else interaction.reply({ embeds: [client.redEmbed(music.cancel)], ephemeral: true });
			if (!serverQueue.songs[0]) serverQueue.stop();
			return msg.delete();
		}

		const actualVideo = videos[selected.values[0] as unknown as number];
		serverQueue.handleVideo(actualVideo, interaction.user.id);
		return interaction.editReply({ embeds: [client.blueEmbed(music.play.added_to_queue.description.replace('{song}', `**${actualVideo.title}**`))] });
	}
});
