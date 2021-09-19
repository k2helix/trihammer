const { ModelUsers } = require('../../utils/models');
module.exports = {
	name: 'profimage',
	description: 'Set your [profile image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images)',
	ESdesc: 'Establece tu [imagen de perfil](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images)',
	usage: 'profile-image <image>',
	example: 'profile-image 2',
	aliases: ['profile-image', 'profileimage'],
	type: 5,
	async execute(client, interaction) {
		let selected = interaction.options.getString('image');
		let images = {
			pione: 'https://cdn.discordapp.com/attachments/487962590887149603/716052349851795496/images.png',
			pitwo: 'https://cdn.discordapp.com/attachments/487962590887149603/716052326154108980/images.png',
			pithree: 'https://cdn.discordapp.com/attachments/487962590887149603/716052302389313676/images.png',
			pifour: 'https://cdn.discordapp.com/attachments/487962590887149603/716052163025174588/2Q.png',
			pifive: 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
			pisix: 'https://cdn.discordapp.com/attachments/487962590887149603/716052072981856256/abstract-background-3036235_960_720.png',
			piseven: 'https://cdn.discordapp.com/attachments/588140412036841482/715736357892390982/heart-5209050_1920.jpg',
			pieight: 'https://cdn.discordapp.com/attachments/588140412036841482/715736559126708294/ferris-wheel-5228823_1280.png',
			pinine: 'https://cdn.discordapp.com/attachments/588140412036841482/715736136227749942/hall-5215746_1920.jpg',
			piten: 'https://cdn.discordapp.com/attachments/588140412036841482/715735767481319474/animal-1845263_1920.jpg',
			pieleven: 'https://cdn.discordapp.com/attachments/588140412036841482/715735868434022460/rabbit-542554_1920.jpg'
		};
		if (!images[selected]) return interaction.reply('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images');
		let global = await ModelUsers.findOne({ id: interaction.user.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: interaction.user.id,
				globalxp: 0,
				pimage: images[selected],
				rimage: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
			return;
		}
		global.pimage = images[selected];
		await global.save();

		client.interactionCommands.get('profile').execute(client, interaction);
	}
};
