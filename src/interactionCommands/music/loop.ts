const { MessageEmbed } = require('discord.js');
const { queue } = require('../../lib/modules/music');
module.exports = {
	name: 'loop',
	description: 'Put the queue in loop',
	ESdesc: 'Pon la cola en loop',
	usage: 'loop',
	example: 'loop',
	aliases: ['l'],
	type: 6,
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);

		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		serverQueue.loop = !serverQueue.loop;
		// queue.set(interaction.guildId, serverQueue);
		if (serverQueue.loop) return interaction.reply({ content: music.loop.enabled, ephemeral: interaction.isButton() });
		else return interaction.reply({ content: music.loop.disabled, ephemeral: interaction.isButton() });
	}
};
