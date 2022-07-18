import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'remove',
	description: 'Remove a song from the queue',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || !interaction.isChatInputCommand()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const serverQueue = queue.get(interaction.guildId!);
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		let id = parseInt(interaction.options.getString('id')!);
		if (isNaN(id)) return interaction.reply({ embeds: [client.redEmbed(music.need_qnumber)], ephemeral: true });
		if (id === 1) return interaction.reply({ embeds: [client.redEmbed(music.cannot_remove)], ephemeral: true });

		const index = id - 1;
		const song = serverQueue.songs[index];
		if (!song) return interaction.reply({ embeds: [client.redEmbed(music.song_404)], ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		let permission = interaction.member.roles.cache.has(djRole ? djRole.id : '') || interaction.member.id === song.requested;
		if (!permission) return interaction.reply({ embeds: [client.redEmbed(music.need_dj.remove)], ephemeral: true });

		if (interaction.options.getBoolean('slice')) {
			serverQueue.songs = serverQueue.songs.slice(0, index);
			return interaction.reply({ embeds: [client.orangeEmbed(music.song_removed_and_sliced)] });
		}

		interaction.reply(music.song_removed.replace('{song}', serverQueue.songs[Math.floor(id - 1)].title));
		serverQueue.songs.splice(index, 1);
	}
});
