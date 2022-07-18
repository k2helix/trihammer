import { GuildChannel } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';

export default async (client: ExtendedClient, oldChannel: GuildChannel, newChannel: GuildChannel) => {
	const serverConfig: Server = await ModelServer.findOne({ server: oldChannel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	const logs_channel = oldChannel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || !logs_channel.isTextBased()) return;
	if (oldChannel.position !== newChannel.position) return;
	if (oldChannel.parent !== newChannel.parent) return;

	oldChannel.guild.roles.cache.forEach((role) => {
		const oldroleperms = oldChannel.permissionsFor(role).toArray();
		const newroleperms = newChannel.permissionsFor(role).toArray();
		const addedPerms = newroleperms.filter((x) => !oldroleperms.includes(x));
		const removedPerms = oldroleperms.filter((x) => !newroleperms.includes(x));

		if (addedPerms[0] && removedPerms[0])
			logs_channel.send({
				embeds: [
					client.yellowEmbed(
						client.replaceEach(events.channel.update.both, {
							'{role}': role.name,
							'{channel}': `<#${oldChannel.id}>`,
							'{added}': addedPerms.join(', '),
							'{removed': removedPerms.join(', ')
						})
					)
				]
			});
		else if (addedPerms[0])
			logs_channel.send({
				embeds: [
					client.yellowEmbed(client.replaceEach(events.channel.update.added, { '{role}': role.name, '{channel}': `<#${oldChannel.id}>`, '{perms}': addedPerms.join(', ') }))
				]
			});
		else if (removedPerms[0])
			logs_channel.send({
				embeds: [
					client.yellowEmbed(
						client.replaceEach(events.channel.update.removed, { '{role}': role.name, '{channel}': `<#${oldChannel.id}>`, '{perms}': removedPerms.join(', ') })
					)
				]
			});
	});
};
