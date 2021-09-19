/* eslint-disable no-case-declarations */
const { digitalTime } = require('../../utils/functions');
const { ModelInfrs, ModelTempban, ModelMutes, ModelServer } = require('../../utils/models');
module.exports = {
	name: 'infsearch',
	description: 'Get the infractions of the given user',
	ESdesc: 'Obtén las infracciones del usuario dado',
	usage: 'infsearch <user>',
	example: 'infsearch 714567840581287936',
	aliases: ['inf', 'infractions', 'infrs'],
	type: 2,
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../utils/lang/${serverConfig.lang}`);

		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || (await client.users.fetch(args[0]));
		if (!user) return message.channel.send(mod.need_id);

		let member = message.guild.member(user.id);
		const datos = await ModelInfrs.find({ server: message.guild.id, id: user.id });

		if (!datos[0]) return message.channel.send(mod.infrs_404);
		let infr = [];
		datos.sort((a, b) => {
			return b.time - a.time;
		});

		for (var x in datos) {
			let activo;
			let yes = mod.yes;

			switch (datos[x].tipo) {
				case 'warn':
					activo = 'No';
					break;
				case 'kick':
					activo = message.guild.members.cache.has(datos[x].id) ? 'No' : yes;
					break;
				case 'tempban':
					let tempban = await ModelTempban.findOne({ key: datos[x].key });
					activo = tempban.active ? yes : 'No';
					break;
				case 'mute':
					let mutes = await ModelMutes.findOne({ key: datos[x].key });
					if (!mutes) {
						let rol = message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
						if (!rol) activo = 'No';
						if (member) activo = member.roles.cache.has(rol.id) ? yes : 'No';
					} else activo = mutes.active ? yes : 'No';

					break;
				case 'ban':
					let banusers = await message.guild.fetchBans();
					if (!banusers.has(datos[x].id)) activo = 'No';
					else activo = yes;
					break;
			}

			let modn = datos[x].mod.includes('#') || datos[x].mod.toLowerCase() === 'antispam system' ? null : await client.users.fetch(datos[x].mod);
			let modname = modn ? modn.tag : datos[x].mod;

			infr.push(
				`${datos[x].tipo} | ${modname} | ${datos[x].reason} | ${datos[x].duration || 'N/A'} | ${activo} | ${digitalTime(Number(datos[x].time))} | ${
					datos[x].key
				}`
			);
		}

		message.channel.send(`${mod.user_infrs.replace('{user}', user.tag)}\n${infr.join('\n')}\`\`\``);
	}
};
