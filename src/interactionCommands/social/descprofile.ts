import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'descprofile',
	description: 'Set you profile description',
	category: 'social',
	async execute(client, interaction, guildConf) {
		let text = (interaction as ChatInputCommandInteraction).options.getString('description');
		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'assets/blank.png',
				rimage: 'assets/default-background.png',
				pdesc: text,
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: 0,
				repcooldown: 0
			});
			await newModel.save();
			global = newModel;
		}
		global.pdesc = text;
		await global.save();

		client.interactionCommands.get('profile')!.execute(client, interaction, guildConf);
	}
});
