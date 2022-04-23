import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'viewconfig',
	description: 'View the server configuration',
	required_perms: ['ADMINISTRATOR'],
	required_roles: ['ADMINISTRATOR'],
	execute(_client, message, _args, guildConf) {
		let embed = new MessageEmbed()
			.addField(
				'Logs',
				`Actions: <#${guildConf.actionslogs}>\nInfractions: <#${guildConf.infrlogs}>\nMembers: <#${guildConf.memberlogs}>\nMessages: <#${guildConf.messagelogs}>\nServer: <#${guildConf.serverlogs}>\nVoice: <#${guildConf.voicelogs}>`
			)
			.addField('Roles', `Administrator: <@&${guildConf.adminrole}>\nModerator: <@&${guildConf.modrole}>\nAutorole: <@&${guildConf.autorole}>\n`)
			.addField('Misc', `Prefix: \`${guildConf.prefix}\`\nLanguage: \`${guildConf.lang}\``);
		message.channel.send({ embeds: [embed] });
	}
});
