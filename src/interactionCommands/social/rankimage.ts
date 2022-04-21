import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'rankimage',
	description: 'Set your [rank image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	category: 'social',
	async execute(client, interaction, guildConf) {
		let selected = (interaction as CommandInteraction).options.getString('image')!;

		type image = 'rione' | 'ritwo' | 'rithree' | 'rifour' | 'rifive';
		let images = {
			rione: 'https://cdn.discordapp.com/attachments/487962590887149603/716052206356529162/images.png',
			ritwo: 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
			rithree: 'https://cdn.discordapp.com/attachments/487962590887149603/716052102463356928/2Q.png',
			rifour: 'https://cdn.discordapp.com/attachments/487962590887149603/716052143399895201/9k.png',
			rifive: 'https://cdn.discordapp.com/attachments/684154385408065693/715721659486830603/images.png'
		};

		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png',
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
