import { Message } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, message: Message) => {
	if (message.author.bot || message.system || !message.guild) return;
	const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	let logs_channel = message.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	let attachments = [...message.attachments.values()];
	if (!message.content && !attachments[0]) return;

	let content = `\`\`\`${message.content}\`\`\``;
	if (attachments[0]) content = `\`\`\`${message.content}\`\`\`\n${attachments[0].url.replace('cdn.discordapp.com', 'media.discordapp.net')}`;

	let obj = {
		'{author}': message.author.tag,
		'{channel}': `<#${message.channel.id}>`,
		'{content}': content
	};
	logs_channel.send({ embeds: [client.blackEmbed(client.replaceEach(events.message.delete, obj))] });
};
