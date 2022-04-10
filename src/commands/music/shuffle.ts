import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'shuffle',
	description: 'Set the queue in suffle mode',
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!message.member!.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!serverQueue) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		serverQueue.shuffle = !serverQueue.shuffle;
		// queue.set(message.guild.id, serverQueue);
		if (serverQueue.shuffle) return message.channel.send({ embeds: [client.blueEmbed(music.shuffle.enabled)] });
		else return message.channel.send({ embeds: [client.blueEmbed(music.shuffle.disabled)] });
	}
});
