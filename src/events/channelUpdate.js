const { ModelServer } = require('../utils/models');
module.exports = async (client, oldChannel, newChannel) => {
	if (oldChannel.type === 'dm') return;
	const serverConfig = await ModelServer.findOne({ server: oldChannel.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = oldChannel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'text') return;
	if (oldChannel.position !== newChannel.position) return;
	if (oldChannel.parent !== newChannel.parent) return;

	oldChannel.guild.roles.cache.forEach((role) => {
		let oldroleperms = oldChannel.permissionsFor(role).toArray();
		let newroleperms = newChannel.permissionsFor(role).toArray();
		let nuevoperm = newroleperms.filter((x) => !oldroleperms.includes(x));
		let permremoved = oldroleperms.filter((x) => !newroleperms.includes(x));
		if (langcode === 'es') {
			if (nuevoperm[0] && permremoved[0])
				return logs_channel.send(
					`Los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}> han cambiado, se le han añadido: \`${nuevoperm.join(
						', '
					)}\`. Se le han removido: \`${permremoved.join(', ')}\``
				);
			else if (permremoved[0])
				return logs_channel.send(`Los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}> han cambiado, se le han removido: \`${permremoved.join(', ')}\``);
			else if (nuevoperm[0])
				return logs_channel.send(`Los permisos del rol \`${role.name}\` en el canal <#${oldChannel.id}> han cambiado, se le ha añadido: \`${nuevoperm.join(', ')}\``);
		} else if (langcode === 'en')
			if (nuevoperm[0] && permremoved[0])
				return logs_channel.send(
					`The permissions of the role \`${role.name}\` in the channel <#${oldChannel.id}> were changed, added: \`${nuevoperm.join(', ')}\`. Removed: \`${permremoved.join(
						', '
					)}\` `
				);
			else if (permremoved[0])
				return logs_channel.send(`The permissions of the role \`${role.name}\` in the channel <#${oldChannel.id}> were changed, removed: \`${permremoved.join(', ')}\``);
			else if (nuevoperm[0])
				return logs_channel.send(`The permissions of the role \`${role.name}\` in the channel <#${oldChannel.id}> were changed, added: \`${nuevoperm.join(', ')}\``);
	});
};
