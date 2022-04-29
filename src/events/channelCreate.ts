import { GuildChannel } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, channel: GuildChannel) => {
	const serverConfig: Server = await ModelServer.findOne({ server: channel.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	const logs_channel = channel.guild.channels.cache.get(serverConfig.serverlogs);
	if (!logs_channel || !logs_channel.isText()) return;

	const mutedR = channel.guild.roles.cache.find((r) => r.name.toLowerCase() == 'trimuted');
	if (mutedR)
		if (channel.type === 'GUILD_TEXT')
			channel.permissionOverwrites.create(mutedR, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			});
		else if (channel.type === 'GUILD_VOICE')
			channel.permissionOverwrites.create(mutedR, {
				CONNECT: false,
				SPEAK: false
			});

	logs_channel.send({ embeds: [client.blueEmbed(client.replaceEach(events.channel.create, { '{channel}': channel.type, '{name}': channel.name }))] });
};
