const { ModelServer, ModelWelc } = require('../../utils/models');
module.exports = {
	name: 'wcolor',
	usage: 'wcolor [hexcolor]',
	aliases: ['welcome-color', 'welcomecolor'],
	type: 3,
	async execute(client, message, args) {
		let welcomeModel = await ModelWelc.findOne({ server: message.guild.id });
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { config, welcome } = require(`../../utils/lang/${serverConfig.lang}`);

		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('MANAGE_MESSAGES');

		if (!adminperms) return message.channel.send(config.admin_perm);

		let color = args[0];
		if (!color || !color.toLowerCase().startsWith('#')) return message.channel.send(welcome.hex);
		// eslint-disable-next-line curly
		if (!welcomeModel) {
			welcomeModel = new ModelWelc({
				server: message.guild.id,
				canal: 'none',
				color: color,
				image: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
				text: `Welcome to ${message.guild.name}`
			});
		}
		welcomeModel.color = color;
		await welcomeModel.save();
		message.channel.send(welcome.wcolor.replace('{color}', color));
	}
};
