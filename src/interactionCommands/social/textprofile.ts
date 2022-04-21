import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelUsers } from '../../lib/utils/models';
export default new Command({
	name: 'textprofile',
	description: 'Set your profile text',
	category: 'social',
	async execute(client, interaction, guildConf) {
		let text = (interaction as CommandInteraction).options.getString('text');
		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png',
				rimage: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
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
