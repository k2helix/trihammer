const { MessageEmbed } = require('discord.js');
const { queue } = require('../../modules/music');
module.exports = {
	name: 'shuffle',
	description: 'Put the queue in shuffle mode',
	ESdesc: 'Pon la cola en modo aleatorio',
	type: 6,
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../utils/lang/${guildConf.lang}`);

		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });
		serverQueue.shuffle = !serverQueue.shuffle;
		// queue.set(interaction.guildId, serverQueue);
		if (interaction.isButton()) {
			let msg = await interaction.channel.messages.fetch(interaction.message.id);
			msg.embeds[0].fields = [
				{
					name: 'Shuffle',
					value: serverQueue.shuffle ? music.shuffle.enabled : music.shuffle.disabled
				}
			];
			if (serverQueue.loop)
				msg.embeds[0].fields.push({
					name: 'Loop',
					value: serverQueue.loop ? music.loop.enabled : music.loop.disabled
				});
			msg.edit({ embeds: [new MessageEmbed(msg.embeds[0])] });
		}
		if (serverQueue.shuffle) return interaction.reply({ content: music.shuffle.enabled, ephemeral: interaction.isButton() });
		else return interaction.reply({ content: music.shuffle.disabled, ephemeral: interaction.isButton() });
	}
};
