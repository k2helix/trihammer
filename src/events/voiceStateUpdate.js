const { ModelServer } = require('../utils/models');
const { queue } = require('../modules/music');
module.exports = async (client, oldState, newState) => {
	const serverConfig = await ModelServer.findOne({ server: oldState.guild.id }).lean();
	if (!serverConfig) return;
	// eslint-disable-next-line no-unused-vars
	let langcode = serverConfig.lang;
	let logs_channel = oldState.guild.channels.cache.get(serverConfig.voicelogs);
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;

	const { music, events } = require(`../utils/lang/${langcode}`);

	if (queue.get(oldState.guild.id)) {
		let serverQueue = queue.get(oldState.guild.id);
		if (!newChannel) {
			if (serverQueue.leaveTimeout) return;
			let members = oldChannel.members;
			if (members.has(client.user.id) && members.size < 2)
				serverQueue.leaveTimeout = setTimeout(() => {
					serverQueue.songs = [];
					serverQueue.connection.destroy();
					queue.delete(oldState.guild.id);
					serverQueue.textChannel.send(music.leave_timeout);
				}, 60000);
		} else if (newChannel.members.has(client.user.id) && serverQueue.leaveTimeout)
			if (serverQueue.songs.length > 0) {
				clearTimeout(serverQueue.leaveTimeout);
				serverQueue.leaveTimeout = null;
			}
	}

	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	if (oldChannel !== newChannel) if (newState.member.user.bot) return;

	let user = `${newState.member.user.tag} (${newState.id})`;

	if (!oldChannel && newChannel) logs_channel.send(events.voice.joined.replaceAll({ '{user}': user, '{channel}': newChannel.name }));
	else if (!newChannel) logs_channel.send(events.voice.left.replaceAll({ '{user}': user, '{channel}': newChannel.name }));
	else if (oldChannel && newChannel) logs_channel.send(events.voice.moved.replaceAll({ '{user}': user, '{oldChannel}': oldChannel.name, '{newChannel}': newChannel.name }));
};
