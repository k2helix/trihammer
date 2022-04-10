const { ModelServer, ModelInfrs } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'delinf',
	description: 'Delete the infraction with the given id',
	ESdesc: 'Borra la infracción con la id dada',
	usage: 'delinf <inf id>',
	example: 'delinf 23',
	type: 2,
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../lib/utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		if (!permiso) return message.channel.send(config.admin_perm);

		const key = args[0];
		if (!key) return message.channel.send(':x:');

		await ModelInfrs.deleteOne({ server: message.guild.id, key: key });
		message.channel.send(mod.delete_infr.replace('{key}', key));
	}
};
