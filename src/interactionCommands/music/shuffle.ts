import Command from '../../lib/structures/Command';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'shuffle',
	description: 'Put the queue in shuffle mode',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;
		const serverQueue = queue.get(interaction.guildId);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.shuffle = !serverQueue.shuffle;
		// queue.set(interaction.guildId, serverQueue);
		interaction.reply({ embeds: [client.blueEmbed(serverQueue.shuffle ? music.shuffle.enabled : music.shuffle.disabled)], ephemeral: interaction.isButton() });
	}
});
