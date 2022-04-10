import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'autoplay',
	description: 'Enable or disable the autoplay (will play recommendations)',
	category: 'music',
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.inCachedGuild()) return;

		if (!interaction.member!.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.autoplay = !serverQueue.autoplay;
		// queue.set(message.guild.id, serverQueue);
		if (serverQueue.autoplay) return interaction.reply({ embeds: [client.blueEmbed(music.autoplay.enabled)] });
		else return interaction.reply({ embeds: [client.blueEmbed(music.autoplay.disabled)] });
	}
});
