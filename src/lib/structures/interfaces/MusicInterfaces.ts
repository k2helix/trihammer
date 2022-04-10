import { TextChannel, VoiceChannel } from 'discord.js';

interface Song {
	id: string;
	title: string;
	duration: string;
	durationInSec: number;
	channel: {
		url: string;
		name: string;
	};
	url: string;
	requested: string;
	seek: number;
	skip: string[];
}
interface Queue {
	textChannel: TextChannel;
	voiceChannel: VoiceChannel;
	songs: Song[];
	volume: number;
	playing: boolean;
	loop: boolean;
	shuffle: boolean;
	autoplay: boolean;
	leaveTimeout: ReturnType<typeof setTimeout> | null;
}
export { Queue, Song };
