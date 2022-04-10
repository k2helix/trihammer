const { MessageEmbed } = require('discord.js');
const { queue } = require('../../lib/modules/music');
module.exports = {
	name: 'shuffle',
	description: 'Put the queue in shuffle mode',
	ESdesc: 'Pon la cola en modo aleatorio',
	type: 6,
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);

		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.shuffle = !serverQueue.shuffle;
		// queue.set(interaction.guildId, serverQueue);
		if (serverQueue.shuffle) return interaction.reply({ content: music.shuffle.enabled, ephemeral: interaction.isButton() });
		else return interaction.reply({ content: music.shuffle.disabled, ephemeral: interaction.isButton() });
	}
};
