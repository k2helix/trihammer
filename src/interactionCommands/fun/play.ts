import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'play',
	description: 'Play with a friend',
	category: 'fun',
	execute(client, interaction, guildConf) {
		client.interactionCommands.get((interaction as ChatInputCommandInteraction).options.data[0].name)!.execute(client, interaction, guildConf);
	}
});
