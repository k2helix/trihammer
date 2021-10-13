const request = require('node-superfetch');
module.exports = async (client, guild) => {
	if (!guild.name) return;
	let server = client.channels.cache.get('640548372574371852');
	server.send(`Me he salido del servidor ${guild.name}. Ahora estoy en ${client.guilds.cache.size} servidores.`);
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
