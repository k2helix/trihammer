import { Role } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
module.exports = async (client: ExtendedClient, oldRole: Role, newRole: Role) => {
	if (oldRole.position !== newRole.position) return;

	let oldroleperms = oldRole.permissions.toArray();
	let newroleperms = newRole.permissions.toArray();
	let addedPerms = newroleperms.filter((x) => !oldroleperms.includes(x));
	let removedPerms = oldroleperms.filter((x) => !newroleperms.includes(x));

	const serverConfig: Server = await ModelServer.findOne({ server: oldRole.guild.id }).lean();
	if (!serverConfig) return;

	let logs_channel = oldRole.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	if (addedPerms[0] && removedPerms[0])
		logs_channel.send({
			embeds: [
				client.yellowEmbed(client.replaceEach(events.role.update.removed, { '{role}': newRole.name, '{added}': addedPerms.join(', '), '{removed}': removedPerms.join(', ') }))
			]
		});
	else if (removedPerms[0])
		logs_channel.send({ embeds: [client.yellowEmbed(client.replaceEach(events.role.update.removed, { '{role}': newRole.name, '{perms}': removedPerms.join(', ') }))] });
	else if (addedPerms[0])
		logs_channel.send({ embeds: [client.yellowEmbed(client.replaceEach(events.role.update.added, { '{role}': newRole.name, '{perms}': addedPerms.join(', ') }))] });
	else logs_channel.send({ embeds: [client.yellowEmbed(events.role.update.none.replace('{role}', newRole.name))] });
};
