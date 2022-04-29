import { Guild, TextChannel } from 'discord.js';
import request from 'node-superfetch';
import config from '../../config.json';
import ExtendedClient from '../lib/structures/Client';
export default async (client: ExtendedClient, guild: Guild) => {
	if (!guild.name) return;
	const channel = client.channels.cache.get(config.logs_channel) as TextChannel;
	channel.send(client.replaceEach(config.strings.server_left, { '{{guild}}': `${guild.name} (${guild.id})`, '{{guildcount}}': client.guilds.cache.size.toString() }));
	if (config['top.gg'])
		await request.post('https://top.gg/api/bots/stats', {
			url: 'https://top.gg/api/bots/stats',
			headers: {
				'Content-Type': 'application/json',
				authorization: process.env.DBL_API_KEY!
			},
			body: JSON.stringify({
				server_count: client.guilds.cache.size,
				shard_id: null,
				shard_count: null
			})
		});
};
