const Discord = require('discord.js');
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
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'help',
	description: 'The help command',
	ESdesc: `El comando de ayuda`,
	usage: 'help',
	example: 'help',
	aliases: ['commands'],
	type: 0,
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let prefix = serverConfig.prefix;
		let help_embed = new Discord.MessageEmbed();
		help_embed.setTitle(util.help.title);
		help_embed.setDescription(util.help.description.replace('{prefix}', prefix));
		help_embed.setColor(`RANDOM`);
		help_embed.setThumbnail(`https://i.imgur.com/t3UesbC.png`);
		help_embed.setURL('https://trihammerdocs.gitbook.io/trihammer/');

		help_embed.addField(
			`${util.help.fields.info} - (${client.commands.filter((cmd) => cmd.type == 0).size})`,
			client.commands
				.filter((cmd) => cmd.type == 0)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.util} - (${client.commands.filter((cmd) => cmd.type == 1).size})`,
			client.commands
				.filter((cmd) => cmd.type == 1)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.image_manipulation} - (${client.commands.filter((cmd) => cmd.type == 4).size})`,
			client.commands
				.filter((cmd) => cmd.type == 4)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.social} - (${client.commands.filter((cmd) => cmd.type == 5).size})`,
			client.commands
				.filter((cmd) => cmd.type == 5)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.music} - (${client.commands.filter((cmd) => cmd.type == 6).size})`,
			client.commands
				.filter((cmd) => cmd.type == 6)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.fun} - (${client.commands.filter((cmd) => cmd.type == 7).size})`,
			client.commands
				.filter((cmd) => cmd.type == 7)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.mod} - (${client.commands.filter((cmd) => cmd.type == 2).size})`,
			client.commands
				.filter((cmd) => cmd.type == 2)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);
		help_embed.addField(
			`${util.help.fields.config} - (${client.commands.filter((cmd) => cmd.type == 3).size})`,
			client.commands
				.filter((cmd) => cmd.type == 3)
				.map((cmd) => `\`${cmd.name}\``)
				.join(', '),
			true
		);

		help_embed.setFooter(client.commands.size + util.help.footer);

		message.channel.send(help_embed);
	}
};
