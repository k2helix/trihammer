import { TextChannel } from 'discord.js';
import { Queue, queue } from '../../lib/modules/music';
import config from '../../../config.json';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'generate',
	description: 'Generate a song using Suno',
	aliases: ['gen'],
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	required_args: [{ index: 0, type: 'string', name: 'prompt', optional: false }],
	async execute(client, message, args, guildConf) {
		if (!config.suno_api) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const voiceChannel = message.member!.voice.channel;
		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (args.join(' ').length > 200) return message.channel.send({ embeds: [client.redEmbed(music.tts.too_long)] });

		if (message.guild.members.me!.voice.channel && message.guild.members.me!.voice.channelId !== voiceChannel.id)
			return message.channel.send({ embeds: [client.redEmbed(music.wrong_vc)] });

		const msg = await message.channel.send({ embeds: [client.loadingEmbed()] });

		request
			.post('http://localhost:3000/api/generate', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt: args.join(' '),
					make_instrumental: false,
					wait_audio: true
				})
			})
			.then(({ body }) => {
				msg.delete();
				//@ts-ignore
				if (body[0].audio_url == 'https://cdn1.suno.ai/None.mp3') return message.channel.send({ embeds: [client.redEmbed(music.not_generated)] });

				const serverQueue = queue.get(message.guild.id) || new Queue({ voiceChannel: voiceChannel, textChannel: message.channel as TextChannel });
				//@ts-ignore
				serverQueue.addFileToQueue(body[0].audio_url, message.author.id, true);
			})
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.catch((err) => {
				message.channel.send({ embeds: [client.redEmbed(music.insufficient_quota + `\n\`${err.message}\``)] });
				msg.delete();
			});
	}
});
