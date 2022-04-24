import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'role',
	description: 'Add or remove a role to the given user',
	category: 'moderation',
	required_perms: ['MANAGE_ROLES'],
	required_roles: ['ADMINISTRATOR'],
	client_perms: ['MANAGE_ROLES'],
	execute(client, interaction, guildConf) {
		let commandName = 'role' + (interaction as CommandInteraction).options.data[0].name;
		client.interactionCommands.get(commandName)!.execute(client, interaction, guildConf);
	}
});
