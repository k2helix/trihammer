const request = require('node-superfetch');
const config = require('../../config.json');
module.exports = async (client, guild) => {
	if (!guild.name) return;
	let server = client.channels.cache.get(config.logs_channel);
	server.send(config.strings.server_joined.replaceAll({ '{{guild}}': `${guild.name} (${guild.id})`, '{{guildcount}}': client.guilds.cache.size }));
	await request.post('https://top.gg/api/bots/stats', {
		headers: {
			'Content-Type': 'application/json',
			authorization: process.env.DBL_API_KEY
		},
		body: JSON.stringify({
			server_count: client.guilds.cache.size,
			shard_id: null,
			shard_count: null
		})
	});
};
