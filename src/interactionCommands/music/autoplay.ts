import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'autoplay',
	description: 'Enable or disable the autoplay (will play recommendations)',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;

		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.autoplay = !serverQueue.autoplay;
		interaction.reply({ embeds: [client.blueEmbed(serverQueue.autoplay ? music.autoplay.enabled : music.autoplay.disabled)] });
	}
});
