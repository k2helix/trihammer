module.exports = {
	name: 'image',
	description: 'Manipulate an image',
	ESdesc: 'Manipula una imagen',
	usage: 'image <action> <image>',
	example: 'play glitch image:link-to-image',
	type: 7,
	cooldown: 5,
	execute(client, interaction, guildConf) {
		client.interactionCommands.get(interaction.options.data[0].name).execute(client, interaction, guildConf);
	}
};
