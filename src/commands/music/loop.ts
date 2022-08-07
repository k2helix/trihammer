import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'loop',
	description: 'Loop the whole queue',
	aliases: ['l'],
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!message.member!.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!serverQueue) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		serverQueue.loop = !serverQueue.loop;
		message.channel.send({ embeds: [client.blueEmbed(serverQueue.loop ? music.loop.enabled : music.loop.disabled)] });
	}
});
