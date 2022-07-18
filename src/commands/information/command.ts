import { EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'command',
	description: 'Receive help about some command',
	aliases: ['cmd'],
	category: 'information',
	required_args: [{ index: 0, name: 'command', type: 'string' }],
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let commandName = args.join(' ');
		let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send({ embeds: [client.redEmbed(util.command.not_found)] });

		let embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`${util.command.title} ${command.name}`)
			.setDescription(command.description)
			.addFields(
				{ name: util.command.fields.required_perms, value: command.required_perms.join(', ') || 'No', inline: true },
				{ name: util.command.fields.required_roles, value: command.required_roles.join(', ') || 'No', inline: true },
				{ name: util.command.fields.alias, value: command.aliases.join(', ') || 'No', inline: true },
				{
					name: util.command.fields.usage,
					value: `${command.name} ${command.required_args.map((a) => (a.optional ? `[${a.name}]` : `<${a.name}>`)).join(' ')}`,
					inline: false
				}
			)
			.setFooter({ text: util.command.footer });

		message.channel.send({ embeds: [embed] });
	}
});
