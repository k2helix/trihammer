import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { queue } from '../../lib/modules/music';
import { getVoiceConnection } from '@discordjs/voice';
export default new Command({
	name: 'volume',
	description: 'Set the queue volume',
	category: 'music',
	cooldown: 3,
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild() || !interaction.isCommand()) return;
		const serverQueue = queue.get(interaction.guildId);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });

		let newVolume = interaction.options.getString('value');
		if (!newVolume) return interaction.reply({ embeds: [client.blackEmbed(`Volume: **${serverQueue.volume}**.`)], ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		if (djRole && !interaction.member.roles.cache.has(djRole.id)) return interaction.reply({ embeds: [client.redEmbed(music.need_dj.volume)], ephemeral: true });

		if (parseFloat(newVolume) > 5) return interaction.reply({ embeds: [client.redEmbed(music.too_much)], ephemeral: true });

		serverQueue.volume = parseFloat(newVolume);
		// @ts-ignore
		getVoiceConnection(serverQueue.voiceChannel.guildId).state.subscription.player.state.resource.volume.setVolumeLogarithmic(parseFloat(newVolume) / 5);
		interaction.reply({ embeds: [client.blueEmbed(music.volume.replace('{volume}', newVolume))] });
	}
});
