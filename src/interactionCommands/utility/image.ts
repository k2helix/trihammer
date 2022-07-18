import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'image',
	description: 'Manipulate an image',
	category: 'image_manipulation',
	cooldown: 5,
	execute(client, interaction, guildConf) {
		client.interactionCommands.get((interaction as ChatInputCommandInteraction).options.data[0].name)!.execute(client, interaction, guildConf);
	}
});
