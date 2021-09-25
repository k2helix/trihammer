/* eslint-disable no-case-declarations */
const { youtube } = require('../../modules/music');
const { MessageEmbed } = require('discord.js');
const { ModelServer, ModelPlaylists } = require('../../utils/models');
const { handleVideo } = require('../../modules/music');
module.exports = {
	name: 'playlist',
	description: 'Create or add songs into a playlist',
	ESdesc: 'Crea o añade canciones a una playlist',
	usage: 'playlist <list | create | delete>',
	example: 'playlist create',
	aliases: ['pl'],
	type: 6,
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, message, args) {
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { music } = require(`../../utils/lang/${serverConfig.lang}`);
		if (!args[0]) return;
		let playlists = await ModelPlaylists.find({ author: message.author.id }).limit(10);
		const filter = (msg) => msg.author.id === message.author.id;
		switch (args[0]) {
			case 'list':
				if (!playlists[0]) return;
				let cct = 0;

				let possibleArgs = ['top', 'recent', 'by'];
				if (possibleArgs.some((ar) => message.content.toLowerCase().includes(ar))) {
					let optArg;
					if (message.content.toLowerCase().includes('top')) optArg = 'top';
					if (message.content.toLowerCase().includes('recent')) optArg = 'recent';
					if (message.content.toLowerCase().includes('by')) optArg = 'by';

					let selectedPlaylist, pl, voiceChannel, resp, plToPlay;
					switch (optArg) {
						case 'top':
							let topPlaylists = await ModelPlaylists.find().sort({ timesPlayed: -1 }).limit(10);
							let topEmbed = new MessageEmbed()
								.setTitle(music.playlists.titles.top)
								.setColor('RANDOM')
								.setDescription(topPlaylists.map((pl) => `**${++cct}**. ${pl.name}`).join('\n'))
								.setFooter(music.playlists.play_from_other);
							message.channel.send({ embeds: [topEmbed] });

							resp = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

							if (!resp) return;
							if (resp.first().content.toLowerCase().includes('play')) {
								plToPlay = resp.first().content.split(' ')[1];
								if (isNaN(plToPlay)) return message.channel.send(music.must_be_number);
								selectedPlaylist = topPlaylists[parseInt(plToPlay) - 1];
								pl = await ModelPlaylists.findOne({ name: selectedPlaylist.name });
								voiceChannel = message.member.voice.channel;
								if (!voiceChannel) return message.channel.send(music.no_vc);
								if (!pl.songs[0]) return;
								pl.songs.forEach(async (song) => {
									let video = await youtube.getVideoByID(song.id);
									handleVideo(video, message, voiceChannel, true);
								});
								message.channel.send(music.playlist.replace('{playlist}', pl.name));
								pl.timesPlayed = pl.timesPlayed + 1;
								return pl.save();
							}
							break;

						case 'recent':
							let recentPlaylists = await ModelPlaylists.find().sort({ _id: -1 }).limit(10);
							let recentEmbed = new MessageEmbed()
								.setTitle(music.playlists.titles.recent)
								.setColor('RANDOM')
								.setDescription(recentPlaylists.map((pl) => `**${++cct}**. ${pl.name}`).join('\n'))
								.setFooter(music.playlists.play_from_other);
							message.channel.send({ embeds: [recentEmbed] });

							resp = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

							if (!resp) return;
							if (resp.first().content.toLowerCase().includes('play')) {
								plToPlay = resp.first().content.split(' ')[1];
								if (isNaN(plToPlay)) return message.channel.send(music.must_be_number);
								selectedPlaylist = recentPlaylists[parseInt(plToPlay) - 1];
								pl = await ModelPlaylists.findOne({ name: selectedPlaylist.name });
								voiceChannel = message.member.voice.channel;
								if (!voiceChannel) return message.channel.send(music.no_vc);
								if (!pl.songs[0]) return;
								pl.songs.forEach(async (song) => {
									let video = await youtube.getVideoByID(song.id);
									handleVideo(video, message, voiceChannel, true);
								});
								message.channel.send(music.playlist.replace('{playlist}', pl.name));
								pl.timesPlayed = pl.timesPlayed + 1;
								return pl.save();
							}
							break;
						case 'by':
							let user = message.mentions.users.first() || client.users.cache.get(args[2]);
							if (!user) user = args[2] ? await client.users.fetch(args[0]) : message.author;

							let byPlaylists = await ModelPlaylists.find({ author: user.id }).sort({ timesPlayed: -1 }).limit(10);
							if (!byPlaylists[0]) return message.channel.send(music.playlists.no_playlists);
							let byEmbed = new MessageEmbed()
								.setTitle(music.playlists.titles.by + user.username)
								.setColor('RANDOM')
								.setDescription(byPlaylists.map((pl) => `**${++cct}**. ${pl.name}`).join('\n'))
								.setFooter(music.playlists.play_from_other);
							message.channel.send({ embeds: [byEmbed] });

							resp = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

							if (!resp) return;
							if (resp.first().content.toLowerCase().includes('play')) {
								plToPlay = resp.first().content.split(' ')[1];
								if (isNaN(plToPlay)) return message.channel.send(music.must_be_number);
								selectedPlaylist = byPlaylists[parseInt(plToPlay) - 1];
								pl = await ModelPlaylists.findOne({ name: selectedPlaylist.name });
								voiceChannel = message.member.voice.channel;
								if (!voiceChannel) return message.channel.send(music.no_vc);
								if (!pl.songs[0]) return;
								pl.songs.forEach(async (song) => {
									let video = await youtube.getVideoByID(song.id);
									handleVideo(video, message, voiceChannel, true);
								});
								message.channel.send(music.playlist.replace('{playlist}', pl.name));
								pl.timesPlayed = pl.timesPlayed + 1;
								return pl.save();
							}
							break;
					}
					return;
				}
				let listEmbed = new MessageEmbed()
					.setTitle(music.playlists.titles.default)
					.setColor('RANDOM')
					.setDescription(playlists.map((pl) => `**${++cct}**. ${pl.name}`).join('\n'))
					.setFooter(music.playlists.play);
				message.channel.send({ embeds: [listEmbed] });

				const resp = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

				if (!resp) return;
				if (resp.first().content.toLowerCase().includes('play')) {
					let plToPlay = resp.first().content.split(' ')[1];
					if (isNaN(plToPlay)) return message.channel.send(music.must_be_number);
					let selectedPlaylist = playlists[parseInt(plToPlay) - 1];
					let pl = await ModelPlaylists.findOne({ name: selectedPlaylist.name });
					let voiceChannel = message.member.voice.channel;
					if (!voiceChannel) return message.channel.send(music.no_vc);
					if (!pl.songs[0]) return;
					pl.songs.forEach(async (song) => {
						let video = await youtube.getVideoByID(song.id);
						handleVideo(video, message, voiceChannel, true);
					});
					message.channel.send(music.playlist.replace('{playlist}', pl.name));
					pl.timesPlayed = pl.timesPlayed + 1;
					return pl.save();
				}
				if (isNaN(resp.first().content)) return await message.channel.send(music.must_be_number);
				else if (resp.first().content < 1 || resp.first().content > playlists.length + 1) return await message.channel.send(music.must_be_number);
				let selectedPlaylist = playlists[parseInt(resp.first().content) - 1];
				let plSongs = selectedPlaylist.songs;
				let sCount = 0;

				let songEmbed = new MessageEmbed()
					.setTitle(music.playlists.playlist_songs)
					.setColor('RANDOM')
					.setDescription(plSongs.map((s) => `**${++sCount}**. [${s.name}](https://www.youtube.com/watch?v=${s.id})`))
					.setFooter(music.playlists.song_add_or_remove);
				message.channel.send({ embeds: [songEmbed] });

				const songResponse = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

				if (!songResponse) return;
				switch (songResponse.first().content.split(' ')[0]) {
					case 'add':
						message.channel.send(music.playlists.which_song);
						const nameResponse = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

						const searchString = nameResponse.first().content;
						const videos = await youtube.searchVideos(searchString, 10).catch(() => false);
						if (typeof videos === 'boolean' || videos.length < 1) return await message.channel.send(music.not_found);

						let songIndex = 0;
						const embed = new MessageEmbed()
							.setTitle(music.song_select)
							.setColor('#1423aa')
							.setFooter(music.cancel_select)
							.setDescription(`${videos.map((video2) => `**${++songIndex} -** [${video2.title}](${video2.url})`).join('\n')} \n${music.type_a_number}`)
							.setTimestamp();
						await message.channel.send({ embeds: [embed] });

						const videoResponse = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

						if (typeof videoResponse === 'boolean') return await message.channel.send(music.cancel);
						else if (videoResponse.first().content === 'cancel') return await message.channel.send('Ok');
						else if (isNaN(videoResponse.first().content)) return await message.channel.send(music.must_be_number);
						else if (videoResponse.first().content < 1 || videoResponse.first().content > 10) return await message.channel.send(music.must_be_number);

						const videoIndex = parseInt(videoResponse.first().content);
						const video = videos[videoIndex - 1];
						const addedSong = { name: video.title, id: video.id };

						let pModel = await ModelPlaylists.findOne({ author: message.author.id, name: selectedPlaylist.name });
						pModel.songs.push(addedSong);
						pModel.save();
						message.channel.send(music.playlists.added_to_playlist.replace('{song}', addedSong.name));
						break;

					case 'remove':
						if (isNaN(songResponse.first().content.split(' ')[1])) return message.channel.send(music.must_be_number);
						let songToRemove = plSongs[parseInt(songResponse.first().content.split(' ')[1]) - 1];
						let plModel = await ModelPlaylists.findOne({ name: selectedPlaylist.name });
						plModel.songs = plSongs.filter((s) => s.id !== songToRemove.id);
						plModel.save();
						message.channel.send(music.playlists.removed_from_playlist.replace('{song}', songToRemove.name));
						break;
				}
				break;

			case 'create':
				let plName = args.slice(1).join(' ');
				let plWithThatName = await ModelPlaylists.findOne({ name: plName });
				if (plWithThatName) return message.channel.send(music.playlists.same_name);
				let newPlaylist = new ModelPlaylists({
					name: plName,
					author: message.author.id,
					createdAt: Date.now(),
					timesPlayed: 0,
					songs: []
				});
				await newPlaylist.save();
				message.channel.send(music.playlists.playlist_created.replaceAll({ '{name}': plName, '{prefix}': serverConfig.prefix }));
				break;
			case 'delete':
				if (!playlists[0]) return;
				let plCount = 0;
				let delEmbed = new MessageEmbed()
					.setTitle(music.playlists.titles.default)
					.setColor('RANDOM')
					.setDescription(playlists.map((pl) => `**${++plCount}**. ${pl.name}`).join('\n'))
					.setFooter(music.playlists.type_to_remove);
				message.channel.send(delEmbed);

				const response = await message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time'] }).catch(() => false);

				if (!response) return;
				if (response.first().content === 'cancel') return await message.channel.send('Ok');
				else if (isNaN(response.first().content)) return await message.channel.send(music.must_be_number);
				// eslint-disable-next-line prettier/prettier
                else if (response.first().content < 1 || response.first().content > (playlists.length + 1)) return await message.channel.send(music.must_be_number);
				let playlistToDelete = playlists[parseInt(response.first().content) - 1];

				await ModelPlaylists.deleteOne({ name: playlistToDelete.name });
				message.channel.send(music.playlists.playlist_deleted.replace('{pl}', playlistToDelete.name));
				break;
		}
	}
};
