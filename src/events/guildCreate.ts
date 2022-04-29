import { ModelServer, Server } from '../lib/utils/models';
import request from 'node-superfetch';
import config from '../../config.json';
import ExtendedClient from '../lib/structures/Client';
import { Guild, TextChannel } from 'discord.js';
export default async (client: ExtendedClient, guild: Guild) => {
	const channel = client.channels.cache.get(config.logs_channel) as TextChannel;
	guild.members.fetch();
	channel.send(
		client.replaceEach(config.strings.server_joined, {
			'{{guild}}': `${guild.name} (${guild.id})`,
			'{{membercount}}': guild.memberCount.toString(),
			'{{guildcount}}': client.guilds.cache.size.toString()
		})
	);
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

	const serverConfig: Server = await ModelServer.findOne({ server: guild.id }).lean();
	if (!serverConfig) {
		const newGuildModel = new ModelServer({
			server: guild.id,
			modrole: 'none',
			adminrole: 'none',
			messagelogs: 'none',
			voicelogs: 'none',
			actionslogs: 'none',
			memberlogs: 'none',
			serverlogs: 'none',
			infrlogs: 'none',
			prefix: config.default_prefix,
			lang: 'en',
			autorole: 'none',
			antispam: false
		});
		await newGuildModel.save();
	}
};
