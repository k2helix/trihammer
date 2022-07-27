import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'move',
	description: 'Move a song from the queue to another position',
	aliases: ['mv'],
	category: 'music',
	required_args: [
		{ index: 0, type: 'number', name: 'old position' },
		{ index: 1, type: 'number', name: 'new position' }
	],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const serverQueue = queue.get(message.guildId!);
		if (!serverQueue) return await message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		let currentPos = parseInt(args[0]) - 1;
		let newPos = parseInt(args[1]) - 1;

		if (currentPos <= 0) return message.channel.send({ embeds: [client.redEmbed(music.cannot_move)] });
		if (newPos <= 0) newPos = 1;

		let song = serverQueue.songs[currentPos];
		if (!song) return message.channel.send({ embeds: [client.redEmbed(music.song_404)] });
		// if (newPos > serverQueue.songs.length) newPos = serverQueue.songs.length;

		const djRole = message.guild!.roles.cache.find((role) => role.name.toLowerCase() === 'dj');

		let permission = message.member!.roles.cache.has(djRole?.id || '') || message.member!.id === song.requested;
		if (!permission) return message.channel.send({ embeds: [client.redEmbed(music.need_dj.move)] });

		serverQueue.songs.splice(newPos, 0, serverQueue.songs.splice(currentPos, 1)[0]);
		message.channel.send({ embeds: [client.yellowEmbed(music.song_moved.replace('{song}', song.title))] });
	}
});
