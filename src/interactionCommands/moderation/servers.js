const Discord = require('discord.js');
module.exports = {
	name: 'servers',
	description: 'only admin',
	ESdesc: 'only admin',
	type: -1,
	execute(client, message, args) {
		if (message.author.id !== '461279654158925825') return;
		let usuario = client.users.cache.get(args[0]) || message.mentions.users.first() || message.author;
		let filtro = client.guilds.cache.filter((g) => g.members.cache.has(usuario.id));

		let servers = filtro.map((g) => '`' + g.name + '`').join(', ');
		const embed = new Discord.MessageEmbed()
			.setTitle('Servidores en común con ' + usuario.tag)
			.setDescription(servers)
			.addField('Para:', `${client.guilds.cache.size} servidores y ${client.users.cache.size} usuarios.`)
			.setColor('RANDOM');
		message.channel.send({ embeds: [embed] });
	}
};
