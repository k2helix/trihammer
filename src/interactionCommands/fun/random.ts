import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'random',
	description: 'Get a random image',
	category: 'fun',
	execute(client, interaction, guildConf) {
		client.interactionCommands.get((interaction as ChatInputCommandInteraction).options.getString('animal')!)!.execute(client, interaction, guildConf);
	}
});
