import { getVoiceConnection } from '@discordjs/voice';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'stop',
	description: 'Make the bot leave the voice channel',
	aliases: ['st'],
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guildId!);

		if (!message.guild || !message.member) return;
		const voiceChannel = message.member.voice.channel;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!serverQueue) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		const djRole = message.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission =
			message.member.roles.cache.has(djRole ? djRole.id : '') || message.member.id === serverQueue.songs[0].requested || serverQueue.songs[0].requested === 'Autoplay';
		if (!permission) return message.channel.send({ embeds: [client.redEmbed(music.need_dj.stop)] });

		serverQueue.songs = [];
		getVoiceConnection(serverQueue.voiceChannel.guildId!)!.destroy();
		if (serverQueue.leaveTimeout) clearTimeout(serverQueue.leaveTimeout);
		queue.delete(message.guild.id);
	}
});
