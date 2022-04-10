const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'invite',
	description: 'Invite me!',
	ESdesc: '¡Invitame!',
	usage: 'invite',
	example: 'invite',
	aliases: ['support'],
	type: 0,
	async execute(client, message) {
		let embed = new MessageEmbed();
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../lib/utils/lang/${langcode}`);
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setColor('RANDOM');

		embed.setTitle(util.invite.title);
		embed.setDescription(util.invite.description);

		message.channel.send({ embeds: [embed] });
	}
};
