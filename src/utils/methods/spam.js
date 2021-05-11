const spam = require('spamnya');
const { ModelInfrs, ModelMutes } = require('../models');

function check(serverConfig, message) {
	spam.log(message, 50);
	if (spam.tooQuick(10, 15000)) {
		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.hasPermission('MANAGE_MESSAGES');
		if (permiso) return;
		let { mod } = require(`../lang/${serverConfig.lang}`);
		let logs_channel = message.guild.channels.cache.get(serverConfig.infrlogs);
		if (serverConfig.antispam === false) return;

		let mutedR = message.guild.roles.cache.find((r) => r.name.toLowerCase() == 'trimuted');
		if (!mutedR) return;
		if (message.member.roles.cache.has(mutedR.id)) return;

		message.member.roles.add(mutedR.id).then(async () => {
			let infrs = await ModelInfrs.find().lean();
			let key = infrs.length;
			let newModel = new ModelInfrs({
				key: key,
				id: message.author.id,
				server: message.guild.id,
				duration: '1h',
				tipo: 'mute',
				time: `${message.createdTimestamp}`,
				mod: 'Antispam System',
				reason: 'Spam Detected'
			});
			await newModel.save();

			let expiration = Date.now() + 3600000;
			let newMute = new ModelMutes({
				key: key,
				id: message.author.id,
				server: message.guild.id,
				expire: expiration,
				active: true
			});
			await newMute.save();

			message.reply(mod.antispam);
			if (!logs_channel || logs_channel.type !== 'text') return;
			logs_channel.send(`${message.author.tag}` + mod.antispam);
		});
	}
}
module.exports = { check };