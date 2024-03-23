import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'rankimage',
	description: 'Set your [rank image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	category: 'social',
	async execute(client, interaction, guildConf) {
		let selected = (interaction as ChatInputCommandInteraction).options.getString('image')!;

		type image = 'rione' | 'ritwo' | 'rithree' | 'rifour' | 'rifive';
		let images = {
			rione: 'assets/rank/1.png',
			ritwo: 'assets/rank/2.png',
			rithree: 'assets/rank/3.png',
			rifour: 'assets/rank/4.png',
			rifive: 'assets/rank/5.png'
		};

		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'assets/blank.png',
				rimage: images[selected as image],
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
		}
		global.rimage = images[selected as image];
		await global.save();

		client.interactionCommands.get('rank')!.execute(client, interaction, guildConf);
	}
});
