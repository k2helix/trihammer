import { queue } from '../../lib/modules/music';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new MessageCommand({
	name: 'skipto',
	description: 'Skip to the specified song from the queue',
	category: 'music',
	required_args: [{ index: 0, type: 'number', name: 'song id' }],
	async execute(client, message, args, guildConf) {
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const serverQueue = queue.get(message.guild!.id);
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		let song = parseInt(args[0]);
		const djRole = message.guild!.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		if ((djRole && message.member!.roles.cache.has(djRole.id)) || serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size <= 3) {
			serverQueue.songs = serverQueue.songs.slice(song - 2); // -1 to the array position and another -1 because of the skip
			serverQueue.skip();
			return message.channel.send({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		} else return message.channel.send({ embeds: [client.redEmbed(music.skipto_restricted)] });
	}
});
