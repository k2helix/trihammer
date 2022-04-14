import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { queue } from '../../lib/modules/music';
export default new Command({
	name: 'loop',
	description: 'Loop the whole queue',
	category: 'music',
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;
		const serverQueue = queue.get(interaction.guildId);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.loop = !serverQueue.loop;
		interaction.reply({ embeds: [client.blueEmbed(serverQueue.loop ? music.loop.enabled : music.loop.disabled)], ephemeral: interaction.isButton() });
	}
});
