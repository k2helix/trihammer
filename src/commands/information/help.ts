import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
// let object = {
// 	0: `Info`,
// 	1: `Utilidades`,
// 	2: 'Moderación',
// 	3: 'Configuración',
// 	4: 'Manipulación de imágenes',
// 	5: 'Social',
// 	6: 'Música',
// 	7: 'Fun'
// };
export default new MessageCommand({
	name: 'help',
	description: 'The help command',
	aliases: ['commands'],
	category: 'information',
	async execute(client, message, _args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const prefix = guildConf.prefix;

		let commands = {
			info: client.commands.filter((cmd) => cmd.category == 'information'),
			util: client.commands.filter((cmd) => cmd.category == 'utility'),
			mod: client.commands.filter((cmd) => cmd.category == 'moderation'),
			config: client.commands.filter((cmd) => cmd.category == 'configuration'),
			image_manipulation: client.commands.filter((cmd) => cmd.category == 'image_manipulation'),
			social: client.commands.filter((cmd) => cmd.category == 'social'),
			music: client.commands.filter((cmd) => cmd.category == 'music'),
			fun: client.commands.filter((cmd) => cmd.category == 'fun')
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
			help_embed.addField(`${util.help.fields[k]} (${cmds.size})`, cmds.map((cmd) => `\`${cmd.name}\``).join(', ') || 'No', true);
		});

		help_embed.setFooter({ text: client.commands.size + util.help.footer });

		message.channel.send({ embeds: [help_embed] });
	}
});
