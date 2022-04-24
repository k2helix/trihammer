import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'servers',
	description: 'View the servers in common with that user',
	category: 'unknown',
	execute(client, message, args) {
		if (message.author.id !== '461279654158925825') return;
		let usuario = client.users.cache.get(args[0]) || message.mentions.users.first() || message.author;
		let filtro = client.guilds.cache.filter((g) => g.members.cache.has(usuario.id));

		let servers = filtro.map((g) => '`' + g.name + '`').join(', ');
		const embed = new MessageEmbed()
			.setTitle('Servidores en común con ' + usuario.tag)
			.setDescription(servers)
			.addField('Para:', `${client.guilds.cache.size} servidores y ${client.users.cache.size} usuarios.`)
			.setColor('RANDOM');
		message.channel.send({ embeds: [embed] });
	}
});
