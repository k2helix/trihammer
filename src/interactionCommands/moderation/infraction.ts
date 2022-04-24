import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

export default new Command({
	name: 'infraction',
	description: 'View, edit or delete the infractions of the given user',
	category: 'moderation',
	required_roles: ['MODERATOR'],
	required_perms: ['MANAGE_MESSAGES'],
	execute(client, interaction, guildConf) {
		let commandName = (interaction as CommandInteraction).options.data[0].name + 'inf';
		client.interactionCommands.get(commandName)!.execute(client, interaction, guildConf);
	}
});
