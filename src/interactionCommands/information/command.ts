const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'command',
	description: 'Receive help about the specified command',
	ESdesc: 'Recibe ayuda sobre el comando especificado',
	usage: 'command <command>',
	example: 'command profile-text\n command textprofile',
	aliases: ['cmd'],
	type: 0,
	async execute(client, message, args) {
		let commandName = args.join(' ');
		if (!commandName) return message.channel.send(util.command.not_found);
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		let { util } = require(`../../lib/utils/lang/${langcode}`);
		let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.channel.send(util.command.not_found);
		let embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`${util.command.title} ${command.name}`)
			.setDescription(langcode === 'es' ? command.ESdesc : command.description)
			.addField(util.command.fields.usage, command.usage ? command.usage : command.name, true)
			.addField(util.command.fields.example, command.example ? command.example : command.name, true)
			.addField(util.command.fields.alias, command.aliases ? command.aliases.join(', ') : 'No', false)
			.setFooter({ text: util.command.footer });

		message.channel.send({ embeds: [embed] });
	}
};
