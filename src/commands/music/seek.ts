import { handleVideo, queue } from '../../lib/modules/music';
import play from 'play-dl';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new MessageCommand({
	name: 'seek',
	description: 'Jump to a part of the song (only MM:SS)',
	aliases: ['jumpto'],
	category: 'music',
	required_args: [{ index: 0, type: 'string', name: 'timestamp' }],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const serverQueue = queue.get(message.guild!.id);
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		const array = args.join(' ').split(':').reverse();

		const seconds = parseInt(array[0]) || 0;
		const minutes = parseInt(array[1]) * 60 || 0;
		// let hours = array[2] ? array[2] * 60 * 60 : 0

		let all = Math.floor(seconds + minutes /*+ Number(hours)*/);
		if (isNaN(all)) return;
		if (all === 0) all = 0.05;
		const video = await play.video_info(serverQueue.songs[0].url);
		handleVideo(video.video_details, message, voiceChannel, false, all);

		message.channel.send({ embeds: [client.blueEmbed(music.seek.replace('{time}', args.join(' ')))] });
	}
});
