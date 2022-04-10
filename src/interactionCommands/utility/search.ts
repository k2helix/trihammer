module.exports = {
	name: 'search',
	description: 'Search something',
	ESdesc: 'Busca algo',
	usage: 'search <something> query:yourquery',
	example: 'search <something> query:yourquery',
	type: 7,
	cooldown: 5,
	execute(client, interaction, guildConf) {
		if (interaction.options.data[0].name === 'image') interaction.options.data[0].name = 'search-image';
		client.interactionCommands.get(interaction.options.data[0].name).execute(client, interaction, guildConf);
	}
};
