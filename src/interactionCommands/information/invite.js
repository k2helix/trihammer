const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Invite me!',
	ESdesc: '¡Invitame!',
	usage: 'invite',
	example: 'invite',
	aliases: ['support'],
	type: 0,
	execute(client, interaction, guildConf) {
		let embed = new MessageEmbed();
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setColor('RANDOM');

		embed.setTitle(util.invite.title);
		embed.setDescription(util.invite.description);

		interaction.reply({ embeds: [embed] });
	}
};
