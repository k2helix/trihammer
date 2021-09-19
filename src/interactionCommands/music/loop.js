const { MessageEmbed } = require('discord.js');
const { queue } = require('../../modules/music');
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
		const { music } = require(`../../utils/lang/${guildConf.lang}`);

		if (!interaction.member.voice.channel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: music.no_queue, ephemeral: true });
		serverQueue.loop = !serverQueue.loop;
		queue.set(interaction.guildId, serverQueue);
		if (interaction.isButton()) {
			let msg = await interaction.channel.messages.fetch(interaction.message.id);
			msg.embeds[0].fields = [
				{
					name: 'Loop',
					value: serverQueue.loop ? music.loop.enabled : music.loop.disabled
				}
			];
			msg.edit({ embeds: [new MessageEmbed(msg.embeds[0])] });
		}
		if (serverQueue.loop) return interaction.reply({ content: music.loop.enabled, ephemeral: interaction.isButton() });
		else return interaction.reply({ content: music.loop.disabled, ephemeral: interaction.isButton() });
	}
};
