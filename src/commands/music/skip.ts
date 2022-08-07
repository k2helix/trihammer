import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'skip',
	description: 'Skip a song',
	aliases: ['s'],
	category: 'music',
	async execute(client, message, _args, guildConf) {
		if (!message.guild || !message.member) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!message.member.voice.channel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });

		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });

		const djRole = message.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission = message.member.roles.cache.has(djRole?.id || '') || message.member.id === serverQueue.songs[0].requested || serverQueue.songs[0].requested === 'Autoplay';
		if (permission) return serverQueue.skip();

		const members = serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size,
			required = Math.floor(members / 2),
			skips = serverQueue.songs[0].skip;
		if (skips.length >= required) {
			serverQueue.skip();
			return message.channel.send({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		}
		if (skips.includes(message.author.id))
			return message.channel.send({ embeds: [client.orangeEmbed(music.skip.already_voted.replace('{votes}', `${skips.length}/${required}`))] });

		skips.push(message.author.id);
		if (skips.length >= required) {
			serverQueue.skip();
			return message.channel.send({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		} else return message.channel.send({ embeds: [client.orangeEmbed(music.skip.voting.replace('{votes}', `${skips.length}/${required}`))] });
	}
});
