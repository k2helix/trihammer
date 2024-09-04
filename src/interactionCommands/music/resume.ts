import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'resume',
	description: 'Resume the current song',
	category: 'music',
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (serverQueue && !serverQueue.playing && serverQueue.paused && !serverQueue.leaveTimeout) {
			serverQueue.playing = true;
			serverQueue.getPlayer()!.unpause();
			return interaction.reply({ embeds: [client.blueEmbed(music.resume)] });
		}
		return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
	}
});
