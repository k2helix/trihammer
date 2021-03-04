const request = require('node-superfetch');
let { ModelServer } = require('../utils/models');
module.exports = async (client, guild) => {
	let server = client.channels.cache.get('640548372574371852');
	guild.members.fetch();
	setTimeout(() => {
		server.send(
			`Me he unido al servidor ${guild.name} (${guild.id}), que tiene ${guild.members.cache.size} miembros. Su owner es ${guild.owner.user.tag} (${guild.owner.id})`
		);
	}, 30000);
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
	var serverConfig = await ModelServer.findOne({ server: guild.id }).lean();
	if (!serverConfig) {
		let newGuildModel = new ModelServer({
			server: guild.id,
			modrole: 'none',
			adminrole: 'none',
			messagelogs: 'none',
			voicelogs: 'none',
			actionslogs: 'none',
			memberlogs: 'none',
			serverlogs: 'none',
			infrlogs: 'none',
			prefix: 't-',
			lang: 'en',
			autorole: 'none',
			antispam: false
		});
		await newGuildModel.save();
	}
};
