module.exports = {
	name: 'random',
	description: 'Get a random image',
	ESdesc: 'Imagen random',
	usage: 'random <animal>',
	example: 'random duck',
	type: 7,
	execute(client, interaction, guildConf) {
		client.interactionCommands.get(interaction.options.getString('animal')).execute(client, interaction, guildConf);
	}
};
