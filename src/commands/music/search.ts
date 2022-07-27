import { ActionRowBuilder, ComponentType, EmbedBuilder, SelectMenuBuilder, SelectMenuInteraction, TextChannel } from 'discord.js';
import { handleVideo } from '../../lib/modules/music';
import play, { YouTubeVideo } from 'play-dl';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'search',
	description: 'Search a song',
	aliases: ['sc'],
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	required_args: [{ index: 0, type: 'string', name: 'query' }],
	async execute(client, message, args, guildConf) {
		if (!message.guild || !message.member) return;
		const { music, util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const searchString = args.join(' ');
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (message.guild.members.me!.voice.channel && message.guild.members.me!.voice.channelId !== voiceChannel.id)
			return message.channel.send({ embeds: [client.redEmbed(music.wrong_vc)] });

		const videos = (await play.search(searchString, { limit: 10 }).catch((err) => {
			return client.catchError(err, message.channel as TextChannel);
		})) as YouTubeVideo[];
		if (typeof videos === 'boolean' || videos?.length < 1) return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });

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
		let msg = await message.channel.send({ embeds: [embed], components: [row] });
		const filter = (int: SelectMenuInteraction) => int.customId === 'music-search' && int.user.id === message.author.id;
		let selected;
		try {
			selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
			msg.delete();
		} catch (error) {
			message.channel.send({ embeds: [client.redEmbed(music.cancel)] });
			return msg.delete();
		}
		// @ts-ignore
		const actualVideo = videos[selected.values[0]];
		await handleVideo(actualVideo, message, voiceChannel, false);
	}
});
