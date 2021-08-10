const { ModelServer } = require('../../utils/models');
const request = require('node-fetch');
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
		// eslint-disable-next-line prettier/prettier
        if (!voiceChannel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("I need `CREATE_INSTANT_INVITE` permission");

		request(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
			method: 'POST',
			body: JSON.stringify({
				max_age: 86400,
				max_uses: 0,
				target_application_id: '755600276941176913', // youtube together
				target_type: 2,
				temporary: false,
				validate: null
			}),
			headers: {
				Authorization: `Bot ${process.env.TOKEN}`,
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((invite) => {
				if (invite.error || !invite.code) return message.channel.send('❌ | Could not start **YouTube Together**!');
				message.channel.send(music.yttogether + `${voiceChannel.name}: <https://discord.gg/${invite.code}>`);
			})
			.catch((e) => {
				message.channel.send('❌ | Could not start **YouTube Together**!\n' + e.message);
				console.error(e);
			});
	}
};
