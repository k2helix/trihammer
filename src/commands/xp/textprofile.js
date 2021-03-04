const { ModelUsers } = require('../../utils/models');
module.exports = {
	name: 'textprofile',
	description: 'Set your profile text',
	ESdesc: 'Establece tu texto de perfil',
	usage: 'profile-text <text>',
	example: 'profile-text Hola muy buenas tardes',
	aliases: ['proftext', 'textprof', 'profile-text'],
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
				rimage: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.validate();
			global = newModel;
		}
		global.ptext = text;
		await global.save();

		message.channel.send('✅');
	}
};
