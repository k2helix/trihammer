const { ModelServer } = require('../../utils/models');
const { Permissions } = require('discord.js');
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
		if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) return message.channel.send('I need `CREATE_INSTANT_INVITE` permission');

		let invite = await voiceChannel.createInvite({ targetApplication: '880218394199220334', targetType: 2 });
		message.reply({ content: music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code}` });
	}
};
