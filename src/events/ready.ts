import { ActivityType, TextChannel } from 'discord.js';
import config from '../../config.json';
import checkTimeouts from '../lib/modules/intervals';
import ExtendedClient from '../lib/structures/Client';
import { wordOfTheDay } from '../lib/utils/functions';
export default (client: ExtendedClient) => {
	console.log(client.replaceEach(config.strings.ready, { '{{guilds}}': client.guilds.cache.size.toString(), '{{users}}': client.users.cache.size.toString() }));
	if (!client.user) return;
	(client.channels.cache.get(config.logs_channel) as TextChannel)?.send(
		client.replaceEach(config.strings.ready, { '{{guilds}}': client.guilds.cache.size.toString(), '{{users}}': client.users.cache.size.toString() })
	);

	checkTimeouts(client);

	if (client.user.id === '611710846426415107') {
		const wordChannel = client.channels.cache.get('723699363838165113') as TextChannel;
		try {
			wordOfTheDay(client, wordChannel);
		} catch (error) {
			client.catchError(error, wordChannel);
		}
	}
	const actividades = config.activities;

	const status = Math.floor(Math.random() * actividades.length);
	client.user.setPresence({
		status: 'online',
		activities: [
			{
				name: actividades[status][0],
				type: actividades[status][1] as unknown as ActivityType.Playing // not really but who cares
			}
		]
	});
};
