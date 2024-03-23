import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'textprofile',
	description: 'Set your profile text',
	category: 'social',
	async execute(client, interaction, guildConf) {
		let text = (interaction as ChatInputCommandInteraction).options.getString('text');
		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'assets/blank.png',
				rimage: 'assets/default-background.png',
				pdesc: '',
				ptext: text,
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.validate();
			global = newModel;
		}
		global.ptext = text;
		await global.save();

		client.interactionCommands.get('profile')!.execute(client, interaction, guildConf);
	}
});
