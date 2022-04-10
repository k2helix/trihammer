const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'setlang',
	description: 'Set the server language',
	ESdesc: 'Establece el idioma del servidor',
	usage: 'setlang <es/en>',
	example: 'setlang es',
	aliases: ['language', 'idioma', 'lang'],
	type: 3,
	async execute(client, message, args) {
		let idioma = args[0];
		if (!idioma) return;

		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id });

		let langcode = serverConfig.lang;
		let { config } = require(`../../lib/utils/lang/${langcode}`);

		let permiso =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);
		if (!['es', 'en'].includes(idioma.toLowerCase())) return message.channel.send(config.current_languages);

		serverConfig.lang = idioma;
		serverConfig.save();
		message.channel.send(config.lang_set.replace('{idioma}', idioma));
	}
};
