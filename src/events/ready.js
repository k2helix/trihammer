const config = require('../../config.json');
module.exports = (client) => {
	console.log(config.strings.ready.replaceAll({ '{{guilds}}': client.guilds.cache.size, '{{users}}': client.users.cache.size }));
	client.channels.cache.get(config.logs_channel).send(config.strings.ready.replaceAll({ '{{guilds}}': client.guilds.cache.size, '{{users}}': client.users.cache.size }));

	require('../modules/reminders').check(client);

	if (client.user.id === '611710846426415107')
		try {
			require('../utils/functions').wordOfTheDay(client, client.channels.cache.get('723699363838165113'));
		} catch (error) {
			client.channels.cache.get('723699363838165113').send('Ocurrió un error al publicar la palabra del día: ' + error.message);
			console.error(error);
		}

	let actividades = config.activities;

	let status = Math.floor(Math.random() * actividades.length);
	client.user.setPresence({
		status: 'online',
		activities: [
			{
				name: actividades[status][0],
				type: actividades[status][1]
			}
		]
	});
};
