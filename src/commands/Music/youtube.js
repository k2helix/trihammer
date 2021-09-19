const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'youtube',
	description: 'Watch YouTube with friends!',
	ESdesc: 'Mira youtube con amigos!',
	aliases: ['yt', 'yttogether', 'youtubetogether'],
	type: 6,
	myPerms: [true, 'CREATE_INSTANT_INVITE'],
	async execute(client, message) {
		const voiceChannel = message.member.voice.channel;
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);

		if (!voiceChannel) return await message.channel.send(music.no_vc);

		let invite = await voiceChannel.createInvite({ targetApplication: '755600276941176913', targetType: 2 });
		message.channel.send(music.yttogether + `${voiceChannel.name}: <https://discord.gg/${invite.code}>`);
	}
};
