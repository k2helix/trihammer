const Permissions = require('discord.js');
module.exports = {
	name: 'youtube-together',
	description: 'Watch YouTube with friends!',
	ESdesc: 'Mira youtube con amigos!',
	aliases: ['yt', 'yttogether', 'youtube'],
	type: 6,
	myPerms: [true, 'CREATE_INSTANT_INVITE'],
	async execute(client, interaction, guildConf) {
		const { music } = require(`../../utils/lang/${guildConf.lang}`);
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ content: music.no_vc, ephemeral: true });
		if (!voiceChannel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE))
			return interaction.reply({ content: 'I need `CREATE_INSTANT_INVITE` permission', ephemeral: true });

		let invite = await voiceChannel.createInvite({ targetApplication: '755600276941176913', targetType: 2 });
		if (!invite) return interaction.reply({ content: '❌ | Could not start **YouTube Together**!', ephemeral: true });

		if (interaction.isContextMenu()) {
			let user = client.users.cache.get(interaction.targetId);
			user
				.send(music.ytt.yt_invited.replace('{author}', interaction.user.tag) + `https://discord.gg/${invite.code}`)
				.then(() => {
					return interaction.reply(music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code} | ` + music.ytt.yt_dm);
				})
				.catch(() => {
					return interaction.reply(
						`<@${user.id}> ` + music.ytt.yt_invited.replace('{author}', interaction.user.tag) + `https://discord.gg/${invite.code} | ` + music.ytt.yt_nodm
					);
				});
		} else interaction.reply({ content: music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code}` });
	}
};
