const { ModelServer, ModelMutes, ModelInfrs } = require('../utils/models');
module.exports = async (client, member) => {
	const serverConfig = await ModelServer.findOne({ server: member.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = member.guild.channels.cache.get(serverConfig.memberlogs);
	if (!logs_channel || logs_channel.type !== 'text') return;

	logs_channel.send(events.member.remove(member));

	let role = member.guild.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
	if (!role) return;
	if (member.roles.cache.has(role.id)) {
		let infrs = await ModelInfrs.find().lean();
		let mute = await ModelMutes.findOne({ server: member.guild.id, id: member.id, active: true });
		if (mute) return;
		let key = infrs.length;
		let newMute = new ModelMutes({
			id: member.id,
			server: member.guild.id,
			active: true,
			expire: Math.floor(Date.now() + 3600000),
			key: key
		});
		await newMute.save();
	}
};
