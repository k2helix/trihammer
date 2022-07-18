import { PermissionsBitField } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'youtube',
	description: 'Watch YouTube with friends!',
	aliases: ['yt', 'yttogether', 'youtubetogether'],
	category: 'music',
	client_perms: ['CreateInstantInvite'],
	async execute(client, message, _args, guildConf) {
		if (!message.member || !message.guild) return;
		const voiceChannel = message.member.voice.channel;
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (!voiceChannel) return message.channel.send({ embeds: [client.redEmbed(music.no_vc)] });
		if (!voiceChannel.permissionsFor(message.guild.members.me!).has(PermissionsBitField.Flags.CreateInstantInvite))
			return message.channel.send({ embeds: [client.redEmbed('I need `CreateInstantInvite` permission')] });

		let invite = await voiceChannel.createInvite({ targetApplication: '880218394199220334', targetType: 2 });
		message.reply({ content: music.ytt.yttogether + `${voiceChannel.name}: https://discord.gg/${invite.code}` });
	}
});
