module.exports = {
	name: 'play',
	description: 'Play with a friend',
	ESdesc: 'Juega con un amigo',
	usage: 'play <game> user:@user',
	example: 'play connect4 user:@friend',
	type: 7,
	execute(client, interaction, guildConf) {
		client.interactionCommands.get(interaction.options.data[0].name).execute(client, interaction, guildConf);
	}
};
