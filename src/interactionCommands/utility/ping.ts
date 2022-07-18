import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'ping',
	description: 'Ping!',
	category: 'information',
	async execute(client, interaction) {
		interaction.reply('Pinging...');
		let sent = await interaction.fetchReply();
		let content = `Pong! ${sent.createdTimestamp - interaction.createdTimestamp}ms`;
		if ((interaction as ChatInputCommandInteraction).options.getBoolean('advanced')) {
			await ModelUsers.findOne({ id: interaction.user.id });
			content += `\nMongoDB Ping: ${Date.now() - sent.createdTimestamp}ms\nWebsocket: ${client.ws.ping}`;
		}
		interaction.editReply({ embeds: [client.blackEmbed(content)], content: null });
	}
});
