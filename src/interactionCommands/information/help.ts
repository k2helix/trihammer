import { CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'help',
	description: 'The help command',
	category: 'information',
	async execute(client, interaction, guildConf) {
		let { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if ((interaction as CommandInteraction).options.getString('command')) {
			let commandName = (interaction as CommandInteraction).options.getString('command')!;
			let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) return interaction.reply({ embeds: [client.redEmbed(util.command.not_found)], ephemeral: true });

			let embed = new MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`${util.command.title} ${command.name}`)
				.setDescription(command.description)
				.addField(util.command.fields.required_perms, command.required_perms.join(', ') || 'No', true)
				.addField(util.command.fields.required_roles, command.required_roles.join(', ') || 'No', true)
				.addField(util.command.fields.alias, command.aliases.join(', ') || 'No', true)
				.addField(util.command.fields.usage, `${command.name} ${command.required_args.map((a) => (a.optional ? `[${a.name}]` : `<${a.name}>`)).join(' ')}`, false)
				.setFooter({ text: util.command.footer });

			return interaction.reply({ embeds: [embed] });
		}

		let prefix = guildConf.prefix;

		let commands = {
			info: client.commands.filter((cmd) => cmd.category == 'information'),
			util: client.commands.filter((cmd) => cmd.category == 'utility'),
			image_manipulation: client.commands.filter((cmd) => cmd.category == 'image_manipulation'),
			social: client.commands.filter((cmd) => cmd.category == 'social'),
			music: client.commands.filter((cmd) => cmd.category == 'music'),
			fun: client.commands.filter((cmd) => cmd.category == 'fun'),
			mod: client.commands.filter((cmd) => cmd.category == 'moderation'),
			config: client.commands.filter((cmd) => cmd.category == 'configuration')
		};

		let help_embed = new MessageEmbed();
		help_embed.setTitle(util.help.title);
		help_embed.setDescription(util.help.description.replace('{prefix}', prefix));
		help_embed.setColor(`RANDOM`);
		help_embed.setThumbnail(`https://i.imgur.com/t3UesbC.png`);
		help_embed.setURL('https://trihammerdocs.gitbook.io/trihammer/');

		Object.keys(commands).forEach((key) => {
			let k = key as 'info' | 'util' | 'image_manipulation' | 'social' | 'music' | 'fun' | 'mod' | 'config';
			let cmds = commands[k];
			help_embed.addField(`${util.help.fields[k]} - (${cmds.size})`, cmds.map((cmd) => `\`${cmd.name}\``).join(', ') || 'No', true);
		});

		help_embed.setFooter({ text: client.commands.size + util.help.footer });

		interaction.reply({ embeds: [help_embed] });
	}
});
