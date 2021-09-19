const { ModelServer } = require('../utils/models');
const { Permissions } = require('discord.js');
module.exports = async (client, oldRole, newRole) => {
	if (oldRole.position !== newRole.position) return;
	let oldroleperms = oldRole.permissions.toArray();
	let newroleperms = newRole.permissions.toArray();
	let nuevoperm = newroleperms.filter((x) => !oldroleperms.includes(x));
	let permremoved = oldroleperms.filter((x) => !newroleperms.includes(x));
	const serverConfig = await ModelServer.findOne({ server: oldRole.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = oldRole.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	if (!oldRole.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOGS)) return;
	const entry = await oldRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then((audit) => audit.entries.first());

	if (!entry) return;

	let fecha = Date.now() - 10000;
	let user = fecha > entry.createdTimestamp ? 'Bot' : entry.executor.tag;
	if (langcode === 'es')
		if (nuevoperm[0] && permremoved[0])
			logs_channel.send(
				`${user} ha actualizado los permisos del rol \`${newRole.name}\`, se le ha añadido: \`${nuevoperm.join(', ')}\`. Se le ha removido: \`${permremoved.join(', ')}\``
			);
		else if (permremoved[0]) logs_channel.send(`${user} ha actualizado los permisos del rol \`${newRole.name}\`, se le ha removido: \`${permremoved.join(', ')}\``);
		else if (nuevoperm[0]) logs_channel.send(`${user} ha actualizado los permisos del rol \`${newRole.name}\`, se le ha añadido: \`${nuevoperm.join(', ')}\``);
		else logs_channel.send(`Un rol ha sido actualizado: \`${newRole.name}\``);
	else if (langcode === 'en')
		if (nuevoperm[0] && permremoved[0])
			logs_channel.send(`${user} has updated \`${newRole.name}\` role permissions, added: \`${nuevoperm.join(', ')}\`. Removed: \`${permremoved.join(', ')}\``);
		else if (permremoved[0]) logs_channel.send(`${user} has updated \`${newRole.name}\` role permissions, removed: \`${permremoved.join(', ')}\``);
		else if (nuevoperm[0]) logs_channel.send(`${user} has updated \`${newRole.name}\` role permissions, added: \`${nuevoperm.join(', ')}\``);
		else logs_channel.send(`A role has been updated: \`${newRole.name}\``);
};
