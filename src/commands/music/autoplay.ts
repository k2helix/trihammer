import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'autoplay',
	description: 'Enable or disable the autoplay (will play recommendations)',
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!message.member!.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!serverQueue) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		serverQueue.autoplay = !serverQueue.autoplay;
		// queue.set(message.guild.id, serverQueue);
		if (serverQueue.autoplay) return message.channel.send({ embeds: [client.blueEmbed(music.autoplay.enabled)] });
		else return message.channel.send({ embeds: [client.blueEmbed(music.autoplay.disabled)] });
	}
});
