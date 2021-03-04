const { ModelServer } = require('../utils/models');
module.exports = async (client, infr) => {
	const serverConfig = await ModelServer.findOne({ server: infr.guild }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let { mod } = require(`../utils/lang/${langcode}.js`);

	let guild = client.guilds.cache.get(infr.guild);
	let channel = guild.channels.cache.get(serverConfig.infrlogs);
	if (!channel) return;

	let obj = {
		'{user}': infr.user.tag,
		'{id}': infr.user.id,
		'{infr}': infr.type,
		'{time}': infr.time,
		'{mod}': infr.mod,
		'{reason}': infr.reason
	};

	channel.send(mod.infraction_created.replaceAll(obj));
};
