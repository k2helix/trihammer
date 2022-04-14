import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new Command({
	name: 'youtube-together',
	description: 'Watch YouTube with friends!',
	category: 'music',
	client_perms: ['CREATE_INSTANT_INVITE'],
	async execute(client, interaction, guildConf) {
		if (!interaction.inCachedGuild()) return;

		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ embeds: [client.redEmbed(music.no_vc)], ephemeral: true });

		let invite = await voiceChannel.createInvite({ targetApplication: '880218394199220334', targetType: 2 });
		if (!invite) return interaction.reply({ embeds: [client.redEmbed('❌ | Could not start **YouTube Together**!')], ephemeral: true });

		if (interaction.isContextMenu()) {
			let user = client.users.cache.get(interaction.targetId);
			user!
				.send(music.ytt.yt_invited.replace('{author}', interaction.user.tag) + `https://discord.gg/${invite.code}`)
				.then(() => {
					return interaction.reply(music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code} | ` + music.ytt.yt_dm);
				})
				.catch(() => {
					return interaction.reply(
						`<@${user!.id}> ` + music.ytt.yt_invited.replace('{author}', interaction.user.tag) + `https://discord.gg/${invite.code} | ` + music.ytt.yt_nodm
					);
				});
		} else interaction.reply({ content: music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code}` });
	}
});
