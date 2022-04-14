import Command from '../../lib/structures/Command';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { getVoiceConnection } from '@discordjs/voice';
export default new Command({
	name: 'voteskip',
	description: 'Skip a song',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		const serverQueue = queue.get(interaction.guildId);
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		if (interaction.isCommand() && interaction.options.getString('to')) {
			const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
			if ((djRole && interaction.member!.roles.cache.has(djRole.id)) || serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size <= 3) {
				serverQueue.songs = serverQueue.songs.slice(parseInt(interaction.options.getString('to')!) - 2); // -1 to the array position and another -1 because of the skip
				//@ts-ignore
				getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
				return interaction.reply({ embeds: [client.orangeEmbed(music.skip.skipping)] });
			} else return interaction.reply({ embeds: [client.redEmbed(music.skipto_restricted)], ephemeral: true });
		}

		const members = serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size,
			required = Math.floor(members / 2),
			skips = serverQueue.songs[0].skip;
		if (skips.length >= required) {
			// @ts-ignore
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return interaction.reply({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		}
		// eslint-disable-next-line prettier/prettier
		if (skips.includes(interaction.user.id)) return interaction.reply({ embeds: [client.orangeEmbed(music.skip.already_voted.replace('{votes}', `${skips.length}/${required}`))], ephemeral: true });

		skips.push(interaction.user.id);
		if (skips.length >= required) {
			// @ts-ignore
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.stop();
			return interaction.reply({ embeds: [client.orangeEmbed(music.skip.skipping)] });
		} else return interaction.reply({ embeds: [client.orangeEmbed(music.skip.voting.replace('{votes}', `${skips.length}/${required}`))], ephemeral: true });
	}
});
