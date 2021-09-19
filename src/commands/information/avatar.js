const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: "Get your avatar (or one user's avatar)",
	ESdesc: 'Obtén tu avatar (o el de un usuario)',
	usage: 'avatar [user]',
	example: 'avatar\navatar @user\navatar 461279654158925825',
	aliases: ['icon', 'pfp'],
	type: 0,
	async execute(client, message, args) {
		let user = message.mentions.users.first() || (await client.users.fetch(args[0] ? args[0] : message.author.id));
		if (!user) return;
		let info_embed = new MessageEmbed()
			.setTitle(`${user.tag}`)
			.setColor('RANDOM')
			.setDescription(`[Link](${user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })})`)
			.setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
		message.channel.send(info_embed);
	}
};
