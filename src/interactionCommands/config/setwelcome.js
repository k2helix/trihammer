const { ModelServer, ModelWelc } = require('../../utils/models');
module.exports = {
	name: 'setwelcome',
	description: 'Set the welcome channel',
	ESdesc: 'Establece el canal de bienvenidas',
	usage: 'setwelcome [disable] <channel>',
	example: 'setwelcome disable\nsetwelcome #welcome',
	aliases: ['welcome', 'welcomechannel', 'wchannel'],
	type: 3,
	async execute(client, message, args) {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
		if (!channel) return;
		let welcome = await ModelWelc.findOne({ server: message.guild.id });
		const serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let { config } = require(`../../utils/lang/${langcode}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (args[0] === 'disable') {
			welcome.canal = 'none';
			await welcome.save();
			return message.channel.send(':white_check_mark:');
		}
		if (!welcome) {
			let newModel = ModelWelc({
				server: message.guild.id,
				canal: channel.id,
				color: '#ffffff',
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: `Welcome to ${message.guild.name}`
			});
			welcome = newModel;
		}
		welcome.canal = channel.id;
		await welcome.save();
		message.channel.send(config.channel_set.replaceAll({ '{channel}': channel.name, '{logs}': 'welcome' }));
	}
};
