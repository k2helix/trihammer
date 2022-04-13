import { Message } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, old_message: Message, new_message: Message) => {
	if (!old_message.guild || old_message.author.bot) return;
	if (!old_message.content && !new_message.content) return;
	if (old_message.content === new_message.content) return;

	const serverConfig: Server = await ModelServer.findOne({ server: old_message.guild.id }).lean();
	if (!serverConfig) return;

	let { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	const args = new_message.content.slice(serverConfig.prefix.length).split(/ +/);
	const commandName = args.shift()!.toLowerCase();

	if (commandName) client.emit('messageCreate', new_message);

	let logs_channel = old_message.guild.channels.cache.get(serverConfig.messagelogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	if (old_message.content.length > 900 && new_message.content.length > 900) return;

	let obj = {
		'{user}': `${old_message.author.tag} (${old_message.author.id})`,
		'{channel}': `<#${old_message.channel.id}>`
	};

	let embed = new MessageEmbed()
		.setDescription(client.replaceEach(events.message.update, obj))
		.addField(events.message.from, `\`\`\`${old_message.content.slice(0, 1000)}\`\`\``)
		.addField(events.message.to, `\`\`\`${new_message.content.slice(0, 1000)}\`\`\``);
	logs_channel.send({ embeds: [embed] });
};
