import { Collection, Message, MessageEmbed, Snowflake } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, messages: Collection<Snowflake, Message>) => {
	let msg = messages.first();
	if (!msg || !msg?.guild) return;

	const serverConfig: Server = await ModelServer.findOne({ server: msg.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	let logs_channel = msg.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || !logs_channel.isText()) return;

	if (!msg.content) return;
	const array: string[] = [];
	messages.forEach((message) => {
		if (!message.content) return;
		if (message.author.bot || message.system) return;
		array.push(`${message.author.tag} (${message.author.id}): ${message.content}`);
	});
	let obj = {
		'{amount}': array.join('\n').slice(0, 2000).length.toString(),
		'{total}': array.join('\n').length.toString()
	};
	const embed = new MessageEmbed()
		.setTitle(events.message.deleteBulk.deleted.replace('{messages}', messages.size.toString()))
		.setDescription(`\`\`\`css\n${array.join('\n').slice(0, 2000)}\`\`\``)
		.setFooter({ text: client.replaceEach(events.message.deleteBulk.showing, obj) });
	logs_channel.send({ embeds: [embed] });
};
