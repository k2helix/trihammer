import { ChatInputCommandInteraction } from 'discord.js';
import { evaluate } from 'mathjs';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'calculate',
	description: 'Calculate the given expresion',
	category: 'utility',
	execute(client, interaction) {
		let resp;
		try {
			resp = evaluate((interaction as ChatInputCommandInteraction).options.getString('expression')!.replace('x', '*'));
		} catch (e) {
			return;
		}
		if (resp === Infinity) resp = ':ok_hand:';
		interaction.reply({ embeds: [client.lightBlueEmbed(resp.toString())] });
	}
});
