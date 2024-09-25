import { AudioPlayer, AudioResource, StreamType, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { BaseGuildTextChannel, EmbedBuilder, Guild, Message, VoiceBasedChannel } from 'discord.js';
import { InfoData, YouTubeVideo, video_info } from 'play-dl';
import { Readable, Stream } from 'stream';
import fetch from 'node-fetch';
import { compareTwoStrings } from '../utils/functions';
import { ModelServer, Server } from '../utils/models';
import LanguageFile from '../structures/interfaces/LanguageFile';
import { Song } from '../structures/interfaces/MusicInterfaces';
import InvidJS from '@invidjs/invid-js';

const defaultInstance = 'https://invidious.jing.rocks';

const queue: Map<string, Queue> = new Map();

class Queue {
	public readonly guild: Guild;

	public leaveTimeout: ReturnType<typeof setTimeout> | null = null;
	public textChannel: BaseGuildTextChannel;
	public voiceChannel: VoiceBasedChannel;
	public volume = 1;
	public playing = false;
	public paused = false;
	public language = 'en';
	public loop = false;
	public shuffle = false;
	public autoplay = false;
	public currentInstance: string | null = null;
	// public instance: string;
	public songs: Song[] = [];

	constructor(options: { voiceChannel: VoiceBasedChannel; textChannel: BaseGuildTextChannel }) {
		this.voiceChannel = options.voiceChannel;
		this.textChannel = options.textChannel;
		this.guild = options.voiceChannel.guild;
		// this.instance = defaultInstance;
		this.setLang(); // if the guild language is changed while a queue is running, the strings used here will be in this language until it gets destroyed

		if (!getQueue(this.guild)) queue.set(this.guild.id, this);

		try {
			joinVoiceChannel({
				channelId: this.voiceChannel.id,
				guildId: this.guild.id,
				adapterCreator: this.guild.voiceAdapterCreator,
				selfDeaf: true
			});
		} catch (err) {
			this.textChannel.send({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`I could not join the voice channel: \`${(err as Error).message}\``)] });
			queue.delete(this.guild.id);
		}
	}

	public async handleVideo(video: YouTubeVideo, requester: string, fromPlaylist = false) {
		const { music } = (await import(`../utils/lang/${this.language}`)) as LanguageFile;
		const song: Song = {
			id: video.id!,
			title: video.title!,
			duration: video.durationRaw,
			durationInSec: video.durationInSec,
			channel: {
				url: video.channel!.url!,
				name: video.channel!.name!
			},
			url: `https://www.youtube.com/watch?v=${video.id}`,
			requested: requester,
			tryAgainFor: -1,
			seek: 0,
			skip: []
		};
		this.songs.push(song);
		if (this.leaveTimeout && requester !== 'Autoplay') this.clearLeaveTimeout();
		if (this.songs.length === 1) return this.play(this.songs[0]);
		if (!fromPlaylist) this.textChannel.send({ embeds: [this.addedToQueueEmbed(song, music)] });
	}

	public async play(song: Song): Promise<void> {
		if (!song) return this.stop();
		const { music } = (await import(`../utils/lang/${this.language}`)) as LanguageFile;

		const instances = await InvidJS.fetchInstances({
			api_allowed: true
			// url: defaultInstance
		});

		// console.log(instances);
		let instance = instances.find((i) => i.url.includes(defaultInstance)) || instances[Math.floor(Math.random() * instances.length)];

		const maxAttempts = 5;
		let attempts = 0;

		const usedInstances: string[] = [];
		let video;

		while (!video && attempts < maxAttempts && instance) {
			video = await InvidJS.fetchVideo(instance, song.id).catch((error) => {
				console.log(instance.url, error);
				return undefined;
			});

			usedInstances.push(instance.url);
			instance = instances.filter((i) => !usedInstances.includes(i.url))[Math.floor(Math.random() * (instances.length - usedInstances.length))];
			attempts++;
		}

		let format = video?.formats?.find((format) => format.audio_quality === InvidJS.AudioQuality.Medium);

		if (!format) {
			this.textChannel.send(`An error occurred when getting the stream (format, using instance: <${instance?.url}>)`);
			if (song.tryAgainFor > 0) {
				song.tryAgainFor--;
				this.songs.unshift(song);
			} else if (song.tryAgainFor == -1) song.tryAgainFor = maxAttempts;
			return this.handleNextSong();
		}

		let source: Stream | void;
		let loadingMsg: Message | undefined;
		try {
			source = await InvidJS.saveStream(instance, video!, format, false).catch(async (err) => {
				// If the video cannot be played by loading it from the bot side,
				// make it load directly on the instance side which should be allowed
				// to do so.
				if (err.message.includes('Not allowed to download this video!')) {
					loadingMsg = await this.textChannel.send({ embeds: [this.loadingEmbed()] });
					return await InvidJS.saveStream(instance, video!, format, true).catch((err2) => {
						loadingMsg!.delete();
						return this.catchErrorAndSkip(err2);
					});
				} else return this.catchErrorAndSkip(err);
			});

			// if (!(source instanceof Stream)) return this.textChannel.send('An error ocurred when getting the stream');
		} catch (error) {
			return this.catchErrorAndSkip(error);
		}

		if (loadingMsg) loadingMsg!.delete();
		if (!source) {
			this.textChannel.send(`An error occurred when getting the stream (source, using instance: <${instance.url}>)`);
			if (song.tryAgainFor > 0) {
				song.tryAgainFor--;
				this.songs.unshift(song);
			} else if (song.tryAgainFor == -1) song.tryAgainFor = maxAttempts;
			return this.handleNextSong();
		}

		this.currentInstance = instance.url;

		//@ts-ignore
		const resource = createAudioResource(source.rewind(), { inputType: source.type, inlineVolume: true });
		const player = this.getOrCreatePlayer();
		player.play(resource);
		resource.volume?.setVolumeLogarithmic(this.volume / 5);
		this.playing = true;

		if (!song.seek) this.textChannel.send({ embeds: [this.playingEmbed(song, music)] });
	}

	public async playFile(file: Song) {
		const { music } = (await import(`../utils/lang/${this.language}`)) as LanguageFile;
		try {
			const response = await fetch(file.url, { timeout: 5000 }).catch((err) => {
				return this.catchErrorAndSkip(err);
			});

			if (response) {
				const resource = createAudioResource(response.body as unknown as Readable, { inputType: StreamType.Arbitrary, inlineVolume: true });
				const player = this.getOrCreatePlayer();
				player.play(resource);
				resource.volume?.setVolumeLogarithmic(this.volume / 5);
				this.playing = true;
				this.textChannel.send({ embeds: [this.playingEmbed(file, music)] });
			}
		} catch (error) {
			return this.catchErrorAndSkip(error);
		}
	}

	public async addFileToQueue(url: string, requester: string, suno = false) {
		const { music } = (await import(`../utils/lang/${this.language}`)) as LanguageFile;
		const song = {
			id: 'file',
			title: url.slice(url.lastIndexOf('/') + 1),
			duration: '00:00',
			durationInSec: 0,
			channel: {
				url: suno ? 'https://suno.com/' : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				name: suno ? 'Suno' : 'Unknown'
			},
			url: url,
			requested: requester,
			tryAgainFor: -1,
			seek: 0,
			skip: []
		};
		this.songs.push(song);
		if (this.leaveTimeout) this.clearLeaveTimeout();
		if (this.songs.length === 1) return this.playFile(this.songs[0]);
		this.textChannel.send({ embeds: [this.addedToQueueEmbed(song, music)] });
	}

	public async addSunoSongToQueue(url: string, requester: string) {
		const id = url.replace('https://suno.com/song/', '');

		const response = await fetch('http://localhost:3000/api/get?ids=' + id, { headers: { 'Content-Type': 'application/json' } });
		if (response) {
			const data = await response.json();
			this.addFileToQueue(data[0].audio_url, requester, true);
		}
	}

	public async handleNextSong() {
		if (this.autoplay)
			if (this.songs.length == 1 && this.songs[0].id !== 'file') {
				let relatedVideos = (await video_info(this.songs[0].url)).related_videos;
				let firstVidInfo: InfoData | undefined;
				let i = 0;

				/*
					If the first recommendation of the recommended video by youtube is the one that just ended
					(to avoid autoplay playing two songs in loop) OR the video title is very similar OR the recommended
					video is a lot longer than the current one, which is done by checking the difference of durations
					but should (commented) be done following a least-squares adjustment process with the following input:
					(previous_vid_duration, max_recommended_vid_duration)- (1,5), (2,6), (3,7), (4,7), (5,8), (60,90)
					get another until this stops happening;

					Note that the first condition (firstVidInfo.related_videos[0] === this.songs[0].url) does not
					really make sense as it's possible that when fetching the recommended video (later, when
					autoplay is called for a second time) for firstVidInfo
					1 - the related videos change
					2 - the current song is a recommendation but not the first one. If this happens, this
						algorithm could discard every related video except the one which is the current song.
					So it is possible that a song is being played, then autoplay plays another song and then
					autoplay plays the previous song again. Possible but unlikely.
				*/
				while (
					i < relatedVideos.length &&
					(!firstVidInfo ||
						firstVidInfo.related_videos[0] === this.songs[0].url ||
						compareTwoStrings(this.songs[0].title.toLowerCase(), firstVidInfo.video_details.title!.toLowerCase()) > 0.8 ||
						firstVidInfo.video_details.durationInSec - this.songs[0].durationInSec > 3000)
					// firstVidInfo.video_details.durationInSec > 1.46 * this.songs[0].durationInSec + 2.246 * 60)
				) {
					try {
						firstVidInfo = await video_info(relatedVideos[i]);
						// console.log(i, firstVidInfo.video_details.title);
					} catch (error) {
						console.error(error);
					}
					i++;
				}

				if (!firstVidInfo) {
					this.textChannel.send('Tried to fetch a recommended video but got none. **Aborting queue**');
					return this.stop();
				}

				// do firstVid = (await video_info(relatedVideos[i++])).video_details;
				// while (
				// 	(await video_info(firstVid.url)).related_videos[0] === this.songs[0].url ||
				// 	compareTwoStrings(this.songs[0].title.toLowerCase(), firstVid.title!.toLowerCase()) > 0.8 ||
				// 	firstVid.durationInSec - this.songs[0].durationInSec > 3000
				// );
				this.songs.shift();
				return this.handleVideo(firstVidInfo?.video_details, 'Autoplay');
			}

		if (this.loop) {
			this.songs.push(this.songs.shift()!);
			this.songs[this.songs.length - 1].seek = 0;
		} else this.songs.shift();

		if (!this.songs[0]) {
			if (!this.leaveTimeout)
				this.leaveTimeout = setTimeout(() => {
					this.stop();
				}, 30000);
		} else {
			if (this.shuffle && this.songs[0].seek === 0) this.songs.splice(0, 0, this.songs.splice(Math.floor(Math.random() * this.songs.length), 1)[0]); //swap(serverQueue.songs, 0, Math.floor(Math.random() * serverQueue.songs.length)); // change the song that is gonna be played with a random song
			this.songs[0].id === 'file' ? this.playFile(this.songs[0]) : this.play(this.songs[0]);
		}
	}

	private async catchErrorAndSkip<T>(error: T) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		const { music } = (await import(`../utils/lang/${this.language}`)) as LanguageFile;
		Promise.reject(error); //cannot call client.catchError here, so handle it with the unhandledRejection event in the index file

		this.textChannel.send({
			embeds: [new EmbedBuilder().setDescription(music.error_stream.replace('{video}', this.songs[0]?.title || 'video') + `\`${error.message}\``).setColor('Red')]
		});
		this.handleNextSong();
	}

	public stop() {
		this.songs = [];
		if (this.leaveTimeout) this.clearLeaveTimeout();
		this.getPlayer()?.stop();
		queue.delete(this.guild.id);
		this.getConnection()?.destroy();
	}

	public skip() {
		this.getPlayer()?.stop();
	}

	public getResource() {
		// @ts-ignore
		return this.getPlayer()?.state.resource as AudioResource;
	}

	public getPlayer() {
		// @ts-ignore
		return this.getConnection()?.state.subscription?.player as AudioPlayer | undefined;
	}

	public getConnection() {
		return getVoiceConnection(this.guild.id);
	}

	public getPlaybackDuration() {
		// @ts-ignore
		return this.getPlayer()?.state.playbackDuration || 0;
	}

	public clearLeaveTimeout() {
		clearTimeout(this.leaveTimeout!);
		this.leaveTimeout = null;
	}

	public setVolume(volume: number) {
		this.getResource()?.volume?.setVolumeLogarithmic(volume / 5);
		this.volume = volume;
	}

	private async setLang() {
		const guildConfig: Server = await ModelServer.findOne({
			server: this.guild.id
		}).lean();
		this.language = guildConfig.lang;
	}

	private getOrCreatePlayer() {
		let player = this.getPlayer();
		if (!player) {
			player = createAudioPlayer();
			player.on('error', (error) => {
				return this.catchErrorAndSkip(error);
			});
			player.on('stateChange', (oldState, newState) => {
				// @ts-ignore
				if (oldState.resource?.metadata?.seek && !newState.resource) return this.play(this.songs[0]);
				if (oldState.status == 'playing' && newState.status == 'idle') {
					this.playing = false;
					this.handleNextSong();
				}
			});
			this.getConnection()?.subscribe(player);
		}
		return player;
	}

	private addedToQueueEmbed(song: Song, strings: LanguageFile['music']) {
		return new EmbedBuilder()
			.setTitle(strings.play.added_to_queue.title)
			.setDescription(`**[${song.title}](${song.url})**\n[${song.channel.name}](${song.channel.url})`)
			.addFields({ name: strings.play.added_to_queue.duration, value: song.duration || 'Unknown', inline: true })
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	}

	private playingEmbed(song: Song, strings: LanguageFile['music']) {
		return new EmbedBuilder()
			.setTitle(strings.play.now_playing.title)
			.setDescription(`**[${song.title}](${song.url})**\n[${song.channel.name}](${song.channel.url})`)
			.setColor(4494843)
			.addFields(
				{ name: strings.play.now_playing.requested_by, value: `${song.requested === 'Autoplay' ? 'Autoplay' : `<@${song.requested}>`}`, inline: true },
				{ name: strings.play.now_playing.duration, value: song.duration || 'Unknown', inline: true }
			)
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	}

	private loadingEmbed() {
		return new EmbedBuilder().setColor('#5865f2').setImage('https://cdn.discordapp.com/attachments/487962590887149603/999306111360454676/in.gif?size=4096?size=4096');
	}
}

function getQueue(guild: Guild) {
	return queue.get(guild.id);
}

export { Queue, queue };
