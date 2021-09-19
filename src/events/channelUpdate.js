const { ModelServer } = require('../utils/models');
const { Permissions } = require('discord.js');
module.exports = async (client, oldChannel, newChannel) => {
	if (oldChannel.type === 'dm') return;
	const serverConfig = await ModelServer.findOne({ server: oldChannel.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = oldChannel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'text') return;
	if (oldChannel.position !== newChannel.position) return;
	if (oldChannel.parent !== newChannel.parent) return;
	if (!oldChannel.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOGS)) return;
	const entry1 = await oldChannel.guild.fetchAuditLogs().then((audit) => audit.entries.first());
	if (!entry1.action.includes('OVERWRITE')) return;
	const entry = await oldChannel.guild.fetchAuditLogs({ type: entry1.action }).then((audit) => audit.entries.first());
	let fecha = Date.now() - 10000;
	let user = fecha > entry.createdTimestamp ? 'Bot' : entry.executor.tag;
	oldChannel.guild.roles.cache.forEach((role) => {
		let oldroleperms = oldChannel.permissionsFor(role).toArray();
		let newroleperms = newChannel.permissionsFor(role).toArray();
		let nuevoperm = newroleperms.filter((x) => !oldroleperms.includes(x));
		let permremoved = oldroleperms.filter((x) => !newroleperms.includes(x));
		if (langcode === 'es') {
			if (nuevoperm[0] && permremoved[0])
				return logs_channel.send(
					`${user} ha cambiado los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}>, se le ha añadido: \`${nuevoperm.join(
						', '
					)}\`. Se le ha removido: \`${permremoved.join(', ')}\``
				);
			else if (permremoved[0])
				return logs_channel.send(
					`${user} ha cambiado los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}>, se le ha removido: \`${permremoved.join(', ')}\``
				);
			else if (nuevoperm[0])
				return logs_channel.send(`${user} ha cambiado los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}>, se le ha añadido: \`${nuevoperm.join(', ')}\``);
		} else if (langcode === 'en')
			if (nuevoperm[0] && permremoved[0])
				return logs_channel.send(
					`${user} has updated \`${role.name}\` role permissions in the channel <#${oldChannel.id}>, added: \`${nuevoperm.join(', ')}\`. Removed: \`${permremoved.join(
						', '
					)}\` `
				);
			else if (permremoved[0])
				return logs_channel.send(`${user} has updated \`${role.name}\` role permissions in the channel <#${oldChannel.id}>, removed: \`${permremoved.join(', ')}\``);
			else if (nuevoperm[0])
				return logs_channel.send(`${user} has updated \`${role.name}\` role permissions in the channel <#${oldChannel.id}>, added: \`${nuevoperm.join(', ')}\``);
	});
};
