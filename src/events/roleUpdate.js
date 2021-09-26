const { ModelServer } = require('../utils/models');
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

	if (langcode === 'es')
		if (nuevoperm[0] && permremoved[0])
			logs_channel.send(`Permisos del rol \`${newRole.name}\` actualizados, se le ha añadido: \`${nuevoperm.join(', ')}\`. Se le ha removido: \`${permremoved.join(', ')}\``);
		else if (permremoved[0]) logs_channel.send(`Permisos del rol \`${newRole.name}\` actualizados, se le ha removido: \`${permremoved.join(', ')}\``);
		else if (nuevoperm[0]) logs_channel.send(`Permisos del rol \`${newRole.name}\` actualizados, se le ha añadido: \`${nuevoperm.join(', ')}\``);
		else logs_channel.send(`Un rol ha sido actualizado: \`${newRole.name}\``);
	else if (langcode === 'en')
		if (nuevoperm[0] && permremoved[0])
			logs_channel.send(`The permissions of the role \`${newRole.name}\` were updated, added: \`${nuevoperm.join(', ')}\`. Removed: \`${permremoved.join(', ')}\``);
		else if (permremoved[0]) logs_channel.send(`The permissions of the role \`${newRole.name}\` were updated, removed: \`${permremoved.join(', ')}\``);
		else if (nuevoperm[0]) logs_channel.send(`The permissions of the role \`${newRole.name}\` were updated, added: \`${nuevoperm.join(', ')}\``);
		else logs_channel.send(`A role has been updated: \`${newRole.name}\``);
};
