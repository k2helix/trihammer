import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

export default new Command({
	name: 'help',
	description: 'The help command',
	category: 'information',
	async execute(client, interaction, guildConf) {
		let { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if ((interaction as ChatInputCommandInteraction).options.getString('command')) {
			let commandName = (interaction as ChatInputCommandInteraction).options.getString('command')!;
			let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) return interaction.reply({ embeds: [client.redEmbed(util.command.not_found)], ephemeral: true });

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

		let help_embed = new EmbedBuilder();
		help_embed.setTitle(util.help.title);
		help_embed.setDescription(util.help.description.replace('{prefix}', prefix));
		help_embed.setColor(`Random`);
		help_embed.setThumbnail(`https://i.imgur.com/t3UesbC.png`);
		help_embed.setURL('https://trihammerdocs.gitbook.io/trihammer/');

		Object.keys(commands).forEach((key) => {
			let k = key as 'info' | 'util' | 'image_manipulation' | 'social' | 'music' | 'fun' | 'mod' | 'config';
			let cmds = commands[k];
			help_embed.addFields({ name: `${util.help.fields[k]} - (${cmds.size})`, value: cmds.map((cmd) => `\`${cmd.name}\``).join(', ') || 'No', inline: true });
		});

		help_embed.setFooter({ text: client.commands.size + util.help.footer });

		interaction.reply({ embeds: [help_embed] });
	}
});
