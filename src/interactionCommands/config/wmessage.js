const { ModelWelc, ModelServer } = require('../../utils/models');
module.exports = {
	name: 'wmessage',
	description: 'Set the welcome message',
	ESdesc: 'Establece el mensaje de bienvenida',
	usage: 'wmessage <text>',
	example: 'wmessage Bienvenid@ al servidor',
	aliases: ['welcome-message', 'welcomemessage'],
	type: 3,
	async execute(client, message, args) {
		let welcomeModel = await ModelWelc.findOne({ server: message.guild.id });
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { config, welcome } = require(`../../utils/lang/${serverConfig.lang}`);

		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!adminperms) return message.channel.send(config.admin_perm);
		let msg = args.join(' ');
		if (!msg) return;
		// eslint-disable-next-line curly
		if (!welcomeModel) {
			welcomeModel = new ModelWelc({
				server: message.guild.id,
				canal: 'none',
				color: '#ffffff',
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: msg
			});
		}

		welcome.text = msg;
		await welcome.save();
		message.channel.send(welcome.wimage);
	}
};
