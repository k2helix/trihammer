import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'resume',
	description: 'Resume the current song',
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (serverQueue && !serverQueue.playing && !serverQueue.leaveTimeout) {
			serverQueue.playing = true;
			serverQueue.getPlayer()!.unpause();
			return message.channel.send({ embeds: [client.blueEmbed(music.resume)] });
		}
		return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
	}
});
