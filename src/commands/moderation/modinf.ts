/* eslint-disable no-case-declarations */
const { ModelServer, ModelInfrs, ModelMutes, ModelTempban } = require('../../lib/utils/models');
// const { Convert } = require('../../lib/utils/functions');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'modinf',
	description: 'Modify an infraction (time and reason)',
	ESdesc: 'Modifica la duración o razón de una infracción',
	usage: 'modinf <inf id> [duration] <reason>',
	example: 'modinf 124 1h Flood\nmodinf 124 1h\nmodinf 124 Flood',
	type: 2,
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, config } = require(`../../lib/utils/lang/${serverConfig.lang}`);

		let permiso = serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);

		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		const key = args[0];
		let reason;

		if (!key) return;
		if (!args[1]) return message.channel.send(mod.which_edit);

		if (!isNaN(args[1].charAt(0))) {
			const infrs = await ModelInfrs.findOne({ key: key, server: message.guild.id });
			if (!infrs) return;

			reason = args[2] ? args.slice(2).join(' ') : undefined;
			let time = Convert(args[1]);
			let tiempo = Convert(infrs.duration);

			switch (infrs.tipo) {
				case 'tempban':
					let tempban = await ModelTempban.findOne({ key: key, server: message.guild.id });
					let expiration = tempban.expire;
					tempban.expire = Math.floor(expiration - tiempo.tiempo + time.tiempo);
					await tempban.save();
					message.channel.send(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`).then(async () => {
						infrs.duration = args[1];
						if (reason) infrs.reason = reason;
						await infrs.save();
					});
					break;
				case 'ban':
					let newTempban = new ModelTempban({
						id: infrs.id,
						server: infrs.server,
						active: true,
						expire: Math.floor(Date.now() + time.tiempo),
						key: key
					});
					await newTempban.save();
					message.channel.send(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`).then(async () => {
						infrs.duration = args[1];
						if (reason) infrs.reason = reason;
						infrs.tipo = 'tempban';
						await infrs.save();
					});
					break;
				case 'mute':
					let mute = await ModelMutes.findOne({ key: key, server: message.guild.id });
					if (!mute) {
						let newMute = new ModelMutes({
							id: infrs.id,
							server: infrs.server,
							active: true,
							expire: Math.floor(Date.now() + time.tiempo),
							key: key
						});
						await newMute.save();
					} else {
						let expiration = mute.expire;
						mute.expire = Math.floor(expiration - tiempo.tiempo + time.tiempo);
						await mute.save();
					}

					message.channel.send(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`).then(async () => {
						infrs.duration = args[1];
						if (reason) infrs.reason = reason;
						await infrs.save();
					});
					break;
			}
		} else {
			const infrs = await ModelInfrs.findOne({ key: key, server: message.guild.id });
			if (!infrs) return;

			reason = args.slice(1).join(' ');
			infrs.reason = reason;
			await infrs.save();

			message.channel.send(mod.modinf.replace('{infr}', key) + ` Reason: ${reason}`);
		}
	}
};
