const { ModelServer, ModelWelc } = require('../../utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'wimage',
	description: 'Set the welcome image',
	ESdesc: 'Establece la imagen de bienvenida',
	usage: 'wimage <image url>',
	example: 'wimage https://cdn.discordapp.com/attachments/696027669414019133/731209814004334673/emtsad.png',
	aliases: ['welcome-image', 'welcomeimage'],
	type: 3,
	async execute(client, message, args) {
		let welcomeModel = await ModelWelc.findOne({ server: message.guild.id });
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { config, welcome } = require(`../../utils/lang/${serverConfig.lang}`);

		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!adminperms) return message.channel.send(config.admin_perm);
		let image = args[0];
		if (!image || !image.toLowerCase().startsWith('http')) return message.channel.send(welcome.need_url);
		// eslint-disable-next-line curly
		if (!welcomeModel) {
			welcomeModel = new ModelWelc({
				server: message.guild.id,
				canal: 'none',
				color: '#ffffff',
				image: image,
				text: `Welcome to ${message.guild.name}`
			});
		}

		welcomeModel.image = image;
		await welcomeModel.save();
		message.channel.send(welcome.wimage);
	}
};
