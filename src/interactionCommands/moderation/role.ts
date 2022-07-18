import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'role',
	description: 'Add or remove a role to the given user',
	category: 'moderation',
	required_perms: ['ManageRoles'],
	required_roles: ['ADMINISTRATOR'],
	client_perms: ['ManageRoles'],
	execute(client, interaction, guildConf) {
		let commandName = 'role' + (interaction as ChatInputCommandInteraction).options.data[0].name;
		client.interactionCommands.get(commandName)!.execute(client, interaction, guildConf);
	}
});
