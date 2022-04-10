const { ModelUsers } = require('../../lib/utils/models');
module.exports = {
	name: 'rankimage',
	description: 'Set your [rank image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	ESdesc: 'Establece tu [imagen de rango](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	usage: 'rankimage <image>',
	example: 'rankimage 3',
	aliases: ['rank-image'],
	type: 5,
	async execute(client, interaction) {
		let selected = interaction.options.getString('image');
		let images = {
			rione: 'https://cdn.discordapp.com/attachments/487962590887149603/716052206356529162/images.png',
			ritwo: 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
			rithree: 'https://cdn.discordapp.com/attachments/487962590887149603/716052102463356928/2Q.png',
			rifour: 'https://cdn.discordapp.com/attachments/487962590887149603/716052143399895201/9k.png',
			rifive: 'https://cdn.discordapp.com/attachments/684154385408065693/715721659486830603/images.png'
		};
		if (!images[selected]) return interaction.reply('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images');
		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png',
				rimage: images[selected],
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
		}
		global.rimage = images[selected];
		await global.save();

		client.interactionCommands.get('rank').execute(client, interaction);
	}
};
