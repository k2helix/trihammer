import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'volume',
	description: 'Set the volume to x',
	aliases: ['v'],
	cooldown: 3,
	category: 'music',
	required_args: [{ index: 0, type: 'number', name: 'volume', optional: true }],
	async execute(client, message, args, guildConf) {
		const serverQueue = queue.get(message.guild!.id);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!message.member!.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		if (!args[0]) return message.channel.send({ embeds: [client.blackEmbed(`Volume: **${serverQueue.volume}**.`)] });

		const djRole = message.guild!.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		if (djRole && !message.member!.roles.cache.has(djRole.id)) return message.channel.send({ embeds: [client.redEmbed(music.need_dj.volume)] });

		if (parseFloat(args[0]) > 5) return message.channel.send({ embeds: [client.redEmbed(music.too_much)] });

		serverQueue.setVolume(parseFloat(args[0]));
		message.channel.send({ embeds: [client.blueEmbed(music.volume.replace('{volume}', args[0]))] });
	}
});
