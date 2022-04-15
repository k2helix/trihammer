import MessageCommand from '../../lib/structures/MessageCommand';
import { MessageEmbed } from 'discord.js';
export default new MessageCommand({
	name: 'avatar',
	description: 'Get the avatar of someone',
	aliases: ['icon', 'pfp'],
	category: 'information',
	async execute(client, message, args) {
		let givenId = message.mentions.users.first()?.id || args[0] || message.author.id;
		let user = await client.users.fetch(givenId, { force: true });
		if (!user) return;
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag}`)
			.setColor(user.hexAccentColor || 'RANDOM')
			.setDescription(`[Link](${user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })})`)
			.setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
		message.channel.send({ embeds: [info_embed] });
	}
});
