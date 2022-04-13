import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'remove',
	description: 'Remove a song from the queue',
	aliases: ['queueremove', 'songremove', 'rm', 'deletesong'],
	category: 'music',
	required_args: [
		{ index: 0, type: 'number', name: 'song id' },
		{ index: 1, type: 'string', name: 'slice', optional: true }
	],
	async execute(client, message, args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!serverQueue) return await message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		if (!args[0]) return message.channel.send({ embeds: [client.redEmbed(music.need_qnumber)] });
		if (isNaN(parseInt(args[0]))) return message.channel.send({ embeds: [client.redEmbed(music.need_qnumber)] });
		if (args[0] === '1') return await message.channel.send(music.cannot_remove);

		const index = parseInt(args[0]) - 1;
		const song = serverQueue.songs[index];
		if (!song) return message.channel.send({ embeds: [client.redEmbed(music.song_404)] });

		const djRole = message.guild!.roles.cache.find((role) => role.name.toLowerCase() === 'dj');

		if (djRole && !message.member!.roles.cache.has(djRole.id) && message.member!.id !== serverQueue.songs[index].requested)
			return message.channel.send({ embeds: [client.redEmbed(music.need_dj.remove)] });

		if (args[1] === 'slice') {
			serverQueue.songs = serverQueue.songs.slice(0, index);
			return message.channel.send({ embeds: [client.orangeEmbed(music.song_removed_and_sliced)] });
		}
		message.channel.send({ embeds: [client.orangeEmbed(music.song_removed.replace('{song}', serverQueue.songs[Math.floor(parseInt(args[0]) - 1)].title))] });
		serverQueue.songs.splice(index, 1);
	}
});
