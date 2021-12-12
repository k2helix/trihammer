const request = require('node-superfetch');
let { ModelServer } = require('../utils/models');
const config = require('../../config.json');
module.exports = async (client, guild) => {
	let server = client.channels.cache.get(config.logs_channel);
	guild.members.fetch();
	setTimeout(() => {
		server.send(
			config.strings.server_joined.replaceAll({
				'{{guild}}': `${guild.name} (${guild.id})`,
				'{{guildcount}}': client.guilds.cache.size,
				'{{membercount}}': guild.members.cache.size
			})
		);
	}, 30000);
	if (config['top.gg'])
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
