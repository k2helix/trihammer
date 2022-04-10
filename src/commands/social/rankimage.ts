const { ModelUsers } = require('../../lib/utils/models');
module.exports = {
	name: 'rankimage',
	description: 'Set your [rank image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	ESdesc: 'Establece tu [imagen de rango](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	usage: 'rankimage <image>',
	example: 'rankimage 3',
	aliases: ['rank-image'],
	type: 5,
	async execute(client, message, args) {
		let images = {
			'1': 'https://cdn.discordapp.com/attachments/487962590887149603/716052206356529162/images.png',
			'2': 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
			'3': 'https://cdn.discordapp.com/attachments/487962590887149603/716052102463356928/2Q.png',
			'4': 'https://cdn.discordapp.com/attachments/487962590887149603/716052143399895201/9k.png',
			'5': 'https://cdn.discordapp.com/attachments/684154385408065693/715721659486830603/images.png'
		};
		let text = args.join(' ');
		if (!images[text]) return message.channel.send('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images');
		let global = await ModelUsers.findOne({ id: message.author.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: message.author.id,
				globalxp: 0,
				pimage: 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png',
				rimage: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
		}
		global.rimage = images[text];
		await global.save();

		message.channel.send('✅');
	}
};
