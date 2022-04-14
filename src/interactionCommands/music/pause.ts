import { getVoiceConnection } from '@discordjs/voice';
import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'pause',
	description: 'Pause the current song',
	category: 'music',
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (serverQueue && serverQueue.playing && !serverQueue.leaveTimeout) {
			serverQueue.playing = false;
			//@ts-ignore
			getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.pause();
			return interaction.reply({ embeds: [client.blueEmbed(music.pause)] });
		}
		return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
	}
});
