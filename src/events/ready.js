module.exports = (client) => {
	console.log(`el bot ha sido iniciado para ${client.guilds.cache.size} servidores y ${client.users.cache.size} usuarios`);

	require('../utils/methods/interval').check(client);

	try {
		require('../utils/methods/functions').wordOfTheDay(client, client.channels.cache.get('723699363838165113'));
	} catch (error) {
		client.channels.cache.get('723699363838165113').send('Ocurrió un error al publicar la palabra del día: ' + error.message);
		console.error(error);
	}

	let actividades = [
		['my soul', 'WATCHING'],
		['your beats', 'LISTENING'],
		['nonoc', 'LISTENING'],
		['Styx Helix', 'LISTENING'],
		['Redo', 'LISTENING'],
		['Stay Alive', 'LISTENING'],
		['Paradisus-Paradoxum', 'LISTENING'],
		['yo tengo un moco', 'LISTENING'],
		['realize', 'LISTENING'],
		['hopes and dreams', 'WATCHING'],
		['bonetrousle', 'LISTENING'],
		['megalovania', 'LISTENING'],
		['Silence and Motion', 'LISTENING'],
		["don't be afraid", 'PLAYING'],
		['Final Fantasy VIII', 'PLAYING'],
		['force your way', 'PLAYING'],
		['liberi fatali', 'LISTENING'],
		['breezy', 'LISTENING'],
		['Balamb Garden', 'WATCHING'],
		['plin plin plon', 'LISTENING'],
		['Great Grey Wolf Sif', 'WATCHING'],
		['Artorias of the Abyss', 'WATCHING'],
		['Crossing Field', 'WATCHING'],
		['Sword Art Online', 'PLAYING'],
		['Unlasting', 'LISTENING'],
		['Starry Night', 'WATCHING'],
		['Blue Rose', 'WATCHING'],
		['Apocalipsis Minecraft', 'WATCHING'],
		['Universo Wigetta', 'WATCHING'],
		['Planeta Vegetta', 'WATCHING'],
		['Minecraft', 'PLAYING'],
		['KARMALAND', 'WATCHING'],
		['Undertale', 'PLAYING'],
		['Vegetta777', 'WATCHING'],
		['Willyrex', 'WATCHING'],
		['LuzuGames', 'WATCHING'],
		['sTaXxCraft :(((', 'WATCHING'],
		['Hollow Knight', 'PLAYING'],
		['Hallownest', 'WATCHING'],
		['Silksong', 'LISTENING'],
		['Nightmare King Grimm', 'WATCHING']
	];

	let status = Math.floor(Math.random() * actividades.length);
	client.user.setPresence({
		status: 'online',
		activity: {
			name: actividades[status][0],
			type: actividades[status][1]
		}
	});
};
