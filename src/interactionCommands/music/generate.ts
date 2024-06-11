import { TextChannel } from 'discord.js';
import { Queue, queue } from '../../lib/modules/music';
import config from '../../../config.json';
import request from 'node-superfetch';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'generate',
	description: 'Generate a song using Suno',
	category: 'music',
	client_perms: ['Connect', 'Speak'],
	async execute(client, interaction, guildConf) {
		if (!config.suno_api) return;
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const voiceChannel = interaction.member!.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (interaction.options.getString('prompt')!.length > 200) return interaction.reply({ embeds: [client.redEmbed(music.tts.too_long)] });

		if (interaction.guild.members.me!.voice.channel && interaction.guild.members.me!.voice.channelId !== voiceChannel.id)
			return interaction.reply({ embeds: [client.redEmbed(music.wrong_vc)], ephemeral: true });

		const msg = await interaction.reply({ embeds: [client.loadingEmbed()] });

		request
			.post('http://localhost:3000/api/generate', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt: interaction.options.getString('prompt'),
					make_instrumental: false,
					wait_audio: true
				})
			})
			.then(({ body }) => {
				msg.delete();
				//@ts-ignore
				if (body[0].audio_url == 'https://cdn1.suno.ai/None.mp3') return interaction.editReply({ embeds: [client.redEmbed(music.not_generated)] });

				const serverQueue = queue.get(interaction.guild.id) || new Queue({ voiceChannel: voiceChannel, textChannel: interaction.channel as TextChannel });
				//@ts-ignore
				serverQueue.addFileToQueue(body[0].audio_url, message.author.id, true);
			})
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.catch((err) => {
				interaction.editReply({ embeds: [client.redEmbed(music.insufficient_quota + `\n${err.message}`)] });
				msg.delete();
			});
	}
});
