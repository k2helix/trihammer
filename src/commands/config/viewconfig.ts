import MessageCommand from '../../lib/structures/MessageCommand';
import { EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'viewconfig',
	description: 'View the server configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	execute(_client, message, _args, guildConf) {
		let embed = new EmbedBuilder().addFields(
			{
				name: 'Logs',
				value: `Actions: <#${guildConf.actionslogs}>\nInfractions: <#${guildConf.infrlogs}>\nMembers: <#${guildConf.memberlogs}>\nMessages: <#${guildConf.messagelogs}>\nServer: <#${guildConf.serverlogs}>\nVoice: <#${guildConf.voicelogs}>`
			},
			{ name: 'Roles', value: `Administrator: <@&${guildConf.adminrole}>\nModerator: <@&${guildConf.modrole}>\nAutorole: <@&${guildConf.autorole}>\n` },
			{ name: 'Misc', value: `Prefix: \`${guildConf.prefix}\`\nLanguage: \`${guildConf.lang}\`` }
		);
		message.channel.send({ embeds: [embed] });
	}
});
