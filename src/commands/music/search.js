const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { ModelServer } = require('../../utils/models');
const { handleVideo } = require('../../modules/music');
const play = require('play-dl');
module.exports = {
	name: 'search',
	description: 'Search a song',
	ESdesc: 'Busca una canción',
	usage: 'search <song or url>',
	example: 'search paradisus paradoxum',
	aliases: ['sc'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, message, args) {
		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music, util } = require(`../../utils/lang/${langcode}`);

		const searchString = args.join(' ');
		if (!voiceChannel) return message.channel.send({ content: music.no_vc });
		if (message.guild.me.voice.channel && message.guild.me.voice.channelId !== voiceChannel.id) return message.channel.send({ content: music.wrong_vc });

		const videos = await play.search(searchString, { limit: 10 }).catch((err) => {
			console.error(err);
			return message.channel.send(music.error_nothing_found + err.message);
		});
		if (typeof videos === 'boolean' || videos?.length < 1) return message.channel.send({ content: music.not_found });

		let options = [];
		for (let index = 0; index < videos.length; index++) {
			const element = videos[index];
			options.push({ label: `${index + 1}- ${element.title}`.slice(0, 99), value: index.toString() });
		}
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId('music-search').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
		);

		let songIndex = 0;
		const embed = new MessageEmbed()
			.setTitle(music.song_select)
			.setColor('#1423aa')
			.setFooter({ text: music.cancel_select })
			.setDescription(`${videos.map((v) => `**${++songIndex} -** [${v.title}](${v.url}) - ${v.durationRaw}`).join('\n')} \n${music.type_a_number}`)
			.setTimestamp();
		let msg = await message.channel.send({ embeds: [embed], components: [row] });
		const filter = (int) => int.customId === 'music-search' && int.user.id === message.author.id;
		let selected;
		try {
			selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: 'SELECT_MENU' });
			msg.delete();
		} catch (error) {
			message.channel.send({ content: music.cancel });
			return msg.delete();
		}

		const actualVideo = videos[selected.values[0]];
		await handleVideo(actualVideo, message, voiceChannel);
	}
};
