const { ModelUsers } = require('../../utils/models');
module.exports = {
	name: 'descprofile',
	description: 'Set you profile description',
	ESdesc: 'Establece tu descripción de perfil',
	usage: 'profile-desc <description>',
	example: 'profile-desc I like tomatoes',
	aliases: ['profile-desc'],
	type: 5,
	async execute(client, message, args) {
		let text = args.join(' ');
		if (!text) return;
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
				cooldown: 0,
				repcooldown: 0
			});
			await newModel.save();
			global = newModel;
		}
		global.pdesc = text;
		await global.save();

		message.channel.send('✅');
	}
};
