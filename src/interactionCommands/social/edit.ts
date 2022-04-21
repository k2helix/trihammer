import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
export default new Command({
	name: 'edit',
	description: 'Edit your profile',
	category: 'social',
	execute(client, interaction, guildConf) {
		const names = {
			'profile-image': 'profimage',
			'profile-description': 'descprofile',
			'profile-text': 'textprofile',
			'rank-image': 'rankimage'
		};
		client.interactionCommands
			.get(names[(interaction as CommandInteraction).options.data[0].name as 'profile-image' | 'profile-description' | 'profile-text' | 'rank-image'])!
			.execute(client, interaction, guildConf);
	}
});
