/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
const { ModelServer } = require('../utils/models');
module.exports = async (client, oldState, newState) => {
	const serverConfig = await ModelServer.findOne({ server: oldState.guild.id }).lean();
	if (!serverConfig) return;
	let langcode = serverConfig.lang;
	let logs_channel = oldState.guild.channels.cache.get(serverConfig.voicelogs);
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;
	if (!logs_channel || logs_channel.type !== 'text') return;
	if (oldChannel !== newChannel)
		if (langcode === 'es') {
			if (newState.member.user.bot) return;

			if (oldChannel === null && newChannel !== null)
				logs_channel.send(`:green_circle: ${newState.member.user.tag} (${newState.member.id}) se ha unido al canal de voz ${newChannel.name}`);
			else if (newChannel === null)
				logs_channel.send(`:red_circle: ${newState.member.user.tag} (${newState.id}) ha abandonado el canal de voz ${oldChannel.name}`);
			else if (oldChannel && newChannel)
				logs_channel.send(
					`:orange_circle: ${newState.member.user.tag} (${newState.id}) ha abandonado el canal de voz ${oldChannel.name} y se ha unido al canal de voz ${newChannel.name}`
				);
		} else if (langcode === 'en') {
			if (newState.member.user.bot) return;

			let newChannel = newState.channel;
			let oldChannel = oldState.channel;

			if (oldChannel === null && newChannel !== null)
				logs_channel.send(`:green_circle: ${newState.member.user.tag} (${newState.id}) has joined voice channel ${newChannel.name}`);
			else if (newChannel === null)
				logs_channel.send(`:red_circle: ${newState.member.user.tag} (${newState.id}) has left voice channel ${oldChannel.name}`);
			else if (oldChannel && newChannel)
				logs_channel.send(
					`:orange_circle: ${newState.member.user.tag} (${newState.id}) has left voice channel ${oldChannel.name} and has joined voice channel ${newChannel.name}`
				);
		}
};
