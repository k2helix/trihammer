import { ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'ping',
	description: 'Ping!',
	category: 'information',
	async execute(client, interaction) {
		interaction.reply('Pinging...');
		let sent = await interaction.fetchReply();

		let ping = sent.createdTimestamp - interaction.createdTimestamp;
		let content = `Pong! ${ping}ms`;

		if ((interaction as ChatInputCommandInteraction).options.getBoolean('advanced')) {
			await ModelUsers.findOne({ id: interaction.user.id });
			content += `\nMongoDB Ping: ${Date.now() - sent.createdTimestamp}ms\nWebsocket: ${client.ws.ping}`;
		}

		const colorsThreshold = [500, 1000, Infinity];
		const colorsObject = {
			[colorsThreshold[0].toString()]: '#0090ff',
			[colorsThreshold[1].toString()]: 'Orange',
			[colorsThreshold[2].toString()]: 'Red'
		};
		const pingColor = colorsObject[colorsThreshold.find((t) => t >= ping)!.toString() as keyof typeof colorsObject];

		interaction.editReply({ embeds: [client.blackEmbed(content).setColor(pingColor as ColorResolvable)], content: null });
	}
});
