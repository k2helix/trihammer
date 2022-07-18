import { GuildMember } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, oldMember: GuildMember, newMember: GuildMember) => {
	const serverConfig: Server = await ModelServer.findOne({ server: oldMember.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	let logs_channel = oldMember.guild.channels.cache.get(serverConfig.memberlogs);
	if (!logs_channel || !logs_channel.isTextBased()) return;

	if (oldMember.nickname !== newMember.nickname)
		return logs_channel.send(
			client.replaceEach(events.member.update.nickname, {
				'{member}': `${newMember.user.tag} (${newMember.user.id})`,
				'{new}': newMember.displayName,
				'{old}': oldMember.displayName
			})
		);

	let oldRoles = oldMember.roles.cache;
	let newRoles = newMember.roles.cache;

	let addedRoles = newRoles.filter((r) => !oldRoles.has(r.id));
	let removedRoles = oldRoles.filter((r) => !newRoles.has(r.id));

	if (addedRoles.size > 0)
		logs_channel.send({
			embeds: [
				client.yellowEmbed(
					client.replaceEach(events.member.update.role_added, {
						'{member}': `${newMember.user.tag} (${newMember.id})`,
						'{role}': addedRoles.map((r) => `<@&${r.id}>`).join(', ')
					})
				)
			]
		});
	if (removedRoles.size > 0)
		logs_channel.send({
			embeds: [
				client.yellowEmbed(
					client.replaceEach(events.member.update.role_removed, {
						'{member}': `${newMember.user.tag} (${newMember.id})`,
						'{role}': removedRoles.map((r) => `<@&${r.id}>`).join(', ')
					})
				)
			]
		});
};
