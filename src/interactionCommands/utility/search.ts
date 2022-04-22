import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'search',
	description: 'Search something',
	category: 'utility',
	cooldown: 5,
	execute(client, interaction, guildConf) {
		if ((interaction as CommandInteraction).options.data[0].name === 'image') (interaction as CommandInteraction).options.data[0].name = 'search-image';
		client.interactionCommands.get((interaction as CommandInteraction).options.data[0].name)!.execute(client, interaction, guildConf);
	}
});
