module.exports = {
	name: 'edit',
	description: 'Edit your profile',
	ESdesc: 'Edita tu perfil',
	usage: 'edit <something>',
	example: 'edit profile-image',
	type: 7,
	execute(client, interaction, guildConf) {
		const names = {
			'profile-image': 'profimage',
			'profile-description': 'descprofile',
			'profile-text': 'textprofile',
			'rank-image': 'rankimage'
		};
		client.interactionCommands.get(names[interaction.options.data[0].name]).execute(client, interaction, guildConf);
	}
};
