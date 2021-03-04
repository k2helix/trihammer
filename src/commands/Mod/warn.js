const { ModelServer, ModelInfrs } = require('../../utils/models');
module.exports = {
	name: 'warn',
	description: 'Warn an user',
	ESdesc: 'Advierte a un usuario',
	usage: 'warn <user> <reason> [dm]',
	example: 'warn 611710846426415107 too cool -nodm',
	aliases: ['aviso', 'warning'],
	type: 2,
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.hasPermission('MANAGE_MESSAGES');
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('MANAGE_MESSAGES');

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'No';

		if (!member) return message.channel.send(mod.need_id);

		let sendDM = !message.content.toLowerCase().includes('-nodm');

		switch (sendDM) {
			case true:
				member.send(mod.infraction_md.replaceAll({ '{action}': 'warned', '{server}': message.guild.name, '{reason}': reason }));
				break;

			case false:
				reason = reason.slice(0, reason.indexOf('-nodm'));
				break;
		}
		message.channel.send(mod.infraction.replaceAll({ '{user}': member.user.tag, '{action}': 'warned', '{reason}': reason }));

		let infrs = await ModelInfrs.find().lean();
		let key = infrs.length;
		let newModel = new ModelInfrs({
			key: key,
			id: member.id,
			server: message.guild.id,
			duration: 'N/A',
			tipo: 'warn',
			time: `${message.createdTimestamp}`,
			mod: message.author.id,
			reason: reason
		});
		await newModel.save();

		let infraction = {
			user: {
				id: member.id,
				tag: member.user.tag
			},
			type: '⚠️ WARNING',
			time: 'N/A',
			mod: message.author.tag,
			reason: reason,
			guild: message.guild.id
		};

		client.emit('infractionCreate', infraction);
	}
};
