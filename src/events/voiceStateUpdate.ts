import { ModelServer, Server } from '../lib/utils/models';
import { queue } from '../lib/modules/music';
import ExtendedClient from '../lib/structures/Client';
import { VoiceState } from 'discord.js';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { Queue } from '../lib/structures/interfaces/MusicInterfaces';
export default async (client: ExtendedClient, oldState: VoiceState, newState: VoiceState) => {
	const serverConfig: Server = await ModelServer.findOne({ server: oldState.guild.id }).lean();
	if (!serverConfig) return;

	let logs_channel = oldState.guild.channels.cache.get(serverConfig.voicelogs);
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;

	const { music, events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	if (queue.get(oldState.guild.id)) {
		let serverQueue = queue.get(oldState.guild.id) as Queue;
		if (!newChannel) {
			if (serverQueue.leaveTimeout) return;
			let members = oldChannel!.members;
			if (members.has(client.user!.id) && members.size < 2)
				serverQueue.leaveTimeout = setTimeout(() => {
					serverQueue.songs = [];
					serverQueue.connection!.destroy();
					queue.delete(oldState.guild.id);
					serverQueue.textChannel.send(music.leave_timeout);
				}, 60000);
		} else if (newChannel.members.has(client.user!.id) && serverQueue.leaveTimeout)
			if (serverQueue.songs.length > 0) {
				clearTimeout(serverQueue.leaveTimeout);
				serverQueue.leaveTimeout = null;
			}
	}

	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
	if (!newState.member || newState.member.user.bot) return;

	let user = `${newState.member.user.tag} (${newState.id})`;

	if (!oldChannel && newChannel) logs_channel.send({ embeds: [client.blueEmbed(client.replaceEach(events.voice.joined, { '{user}': user, '{channel}': newChannel.name }))] });
	else if (!newChannel && oldChannel)
		logs_channel.send({ embeds: [client.redEmbed(client.replaceEach(events.voice.left, { '{user}': user, '{channel}': oldChannel.name }))] });
	else if (oldChannel && newChannel)
		logs_channel.send({
			embeds: [client.orangeEmbed(client.replaceEach(events.voice.moved, { '{user}': user, '{oldChannel}': oldChannel.name, '{newChannel}': newChannel.name }))]
		});
};
