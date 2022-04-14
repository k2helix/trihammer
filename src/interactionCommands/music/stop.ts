import { getVoiceConnection } from '@discordjs/voice';
import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'stop',
	description: 'Make the bot leave the voice channel',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;

		const serverQueue = queue.get(interaction.guildId);
		const voiceChannel = interaction.member.voice.channel;
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission = interaction.member.roles.cache.has(djRole ? djRole.id : '') || interaction.member.id === serverQueue.songs[0].requested;
		if (!permission) return interaction.reply({ embeds: [client.redEmbed(music.need_dj.stop)], ephemeral: true });

		serverQueue.songs = [];
		getVoiceConnection(serverQueue.voiceChannel.guildId!)!.destroy();
		if (serverQueue.leaveTimeout) clearTimeout(serverQueue.leaveTimeout);
		queue.delete(interaction.guildId);
		interaction.reply({ embeds: [client.blueEmbed('See you next time!')] });
	}
});
