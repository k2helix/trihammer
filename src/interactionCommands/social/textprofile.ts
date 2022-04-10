const { ModelUsers } = require('../../lib/utils/models');
module.exports = {
	name: 'textprofile',
	description: 'Set your profile text',
	ESdesc: 'Establece tu texto de perfil',
	usage: 'profile-text <text>',
	example: 'profile-text Hola muy buenas tardes',
	aliases: ['proftext', 'textprof', 'profile-text'],
	type: 5,
	async execute(client, interaction) {
		let text = interaction.options.getString('text');
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

		client.interactionCommands.get('profile').execute(client, interaction);
	}
};
