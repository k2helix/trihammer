import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'set',
	description: 'Set some configuration',
	category: 'configuration',
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	execute(client, interaction, guildConf) {
		let commandName = (interaction as CommandInteraction).options.data[0].name;
		if (commandName === 'welcome') commandName = 'w' + (interaction as CommandInteraction).options.data[0].options![0].name;
		client.interactionCommands.get(commandName)!.execute(client, interaction, guildConf);
	}
});
