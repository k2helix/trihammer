import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'move',
	description: 'Move a song from the queue to another position',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const serverQueue = queue.get(interaction.guildId!);
		if (!serverQueue) return await interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		let currentPos = parseInt((interaction as ChatInputCommandInteraction).options.getString('current')!) - 1;
		let newPos = parseInt((interaction as ChatInputCommandInteraction).options.getString('new')!) - 1;

		if (currentPos <= 0) return interaction.reply({ embeds: [client.redEmbed(music.cannot_move)], ephemeral: true });
		if (newPos <= 0) newPos = 1;

		let song = serverQueue.songs[currentPos];
		if (!song) return interaction.reply({ embeds: [client.redEmbed(music.song_404)], ephemeral: true });
		// if (newPos > serverQueue.songs.length) newPos = serverQueue.songs.length;

		const djRole = interaction.guild!.roles.cache.find((role) => role.name.toLowerCase() === 'dj');

		let permission = interaction.member.roles.cache.has(djRole?.id || '') || interaction.member.id === song.requested;
		if (!permission) return interaction.reply({ embeds: [client.redEmbed(music.need_dj.move)], ephemeral: true });

		serverQueue.songs.splice(newPos, 0, serverQueue.songs.splice(currentPos, 1)[0]);
		interaction.reply({ embeds: [client.yellowEmbed(music.song_moved.replace('{song}', song.title))] });
	}
});
