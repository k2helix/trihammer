import { Role } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, role: Role) => {
	const serverConfig: Server = await ModelServer.findOne({ server: role.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	let logs_channel = role.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || !logs_channel.isText()) return;

	logs_channel.send({ embeds: [client.redEmbed(client.replaceEach(events.role.delete, { '{role}': `<@&${role.id}>` }))] });
};
