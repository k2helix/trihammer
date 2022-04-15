import { MessageEmbed } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'command',
	description: 'Receive help about some command',
	aliases: ['cmd'],
	category: 'information',
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let commandName = args.join(' ');
		let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send({ embeds: [client.redEmbed(util.command.not_found)] });

		let embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`${util.command.title} ${command.name}`)
			.setDescription(command.description)
			.addField(util.command.fields.required_perms, command.required_perms.join(', ') || 'No', true)
			.addField(util.command.fields.required_roles, command.required_roles.join(', ') || 'No', true)
			.addField(util.command.fields.alias, command.aliases.join(', ') || 'No', true)
			.addField(util.command.fields.usage, `${command.name} ${command.required_args.map((a) => (a.optional ? `[${a.name}]` : `<${a.name}>`)).join(' ')}`, false)
			.setFooter({ text: util.command.footer });

		message.channel.send({ embeds: [embed] });
	}
});
