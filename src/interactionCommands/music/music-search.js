const { youtube } = require('../../modules/music');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { handleVideo } = require('../../modules/music');

module.exports = {
	name: 'music-search',
	description: 'Search a song',
	ESdesc: 'Busca una canción',
	usage: 'search <song or url>',
	example: 'search paradisus paradoxum',
	aliases: ['sc'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, interaction, guildConf) {
		const voiceChannel = interaction.member.voice.channel;
		const { music, util } = require(`../../utils/lang/${guildConf.lang}`);

		const searchString = interaction.options.getString('song');
		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId !== voiceChannel.id) return interaction.reply({ content: music.wrong_vc, ephemeral: true });

		const videos = await youtube.searchVideos(searchString, 10).catch(() => false);
		if (typeof videos === 'boolean' || videos.length < 1) return interaction.reply({ content: music.not_found, ephemeral: true });

		interaction.deferReply();
		let options = [];
		for (let index = 0; index < videos.length; index++) {
			const element = videos[index];
			options.push({ label: `${index + 1}- ${element.title}`.slice(0, 99), value: element.id });
		}
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId('music-search').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
		);

		let songIndex = 0;
		const embed = new MessageEmbed()
			.setTitle(music.song_select)
			.setColor('#1423aa')
			.setFooter(music.cancel_select)
			.setDescription(`${videos.map((video2) => `**${++songIndex} -** [${video2.title}](${video2.url})`).join('\n')} \n${music.type_a_number}`)
			.setTimestamp();
		let msg = await interaction.channel.send({ embeds: [embed], components: [row] });
		const filter = (int) => int.customId === 'music-search' && int.user.id === interaction.user.id;
		let selected;
		try {
			selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
			msg.delete();
		} catch (error) {
			if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel, ephemeral: true });
			else interaction.reply({ content: music.cancel, ephemeral: true });
			return msg.delete();
		}

		const actualVideo = await youtube.getVideoByID(selected.values[0]);

		await handleVideo(actualVideo, interaction, voiceChannel);
		return interaction.editReply({ content: music.play.added_to_queue.description.replace('{song}', `**${actualVideo.title}**`), ephemeral: true });
	}
};
