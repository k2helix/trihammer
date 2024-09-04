import { ModelServer, Server } from '../lib/utils/models';
import { Queue, queue } from '../lib/modules/music';
import ExtendedClient from '../lib/structures/Client';
import { VoiceState } from 'discord.js';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';

function setLeaveTimeout(client: ExtendedClient, serverQueue: Queue, music: LanguageFile['music']) {
	serverQueue.leaveTimeout = setTimeout(() => {
		serverQueue!.textChannel.send({ embeds: [client.redEmbed(music.leave_timeout)] });
		serverQueue.stop();
	}, 60000);
}

export default async (client: ExtendedClient, oldState: VoiceState, newState: VoiceState) => {
	const serverConfig: Server = await ModelServer.findOne({ server: oldState.guild.id }).lean();
	if (!serverConfig) return;

	let logs_channel = oldState.guild.channels.cache.get(serverConfig.voicelogs);
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;

	const { music, events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	let member = newState.member!;

	const serverQueue = queue.get(oldState.guild.id);
	if (serverQueue && (serverQueue.voiceChannel.id === oldChannel?.id || serverQueue.voiceChannel.id === newChannel?.id))
		if (member.id === client.user!.id && newChannel && oldChannel) {
			serverQueue.voiceChannel = newChannel;
			if (serverQueue.leaveTimeout && newChannel.members!.filter((m) => !m.user.bot).size > 0 && serverQueue.songs.length > 0) serverQueue.clearLeaveTimeout();
			else if (!serverQueue.leaveTimeout && newChannel.members!.filter((m) => !m.user.bot).size === 0) setLeaveTimeout(client, serverQueue, music);
		} else if (!newChannel || newChannel.id !== serverQueue.voiceChannel.id) {
			let members = oldChannel!.members;
			// if the bot was disconnected
			if (member.id === client.user!.id) {
				if (serverQueue.leaveTimeout) serverQueue.clearLeaveTimeout();
				serverQueue.stop();
				return queue.delete(oldState.guild.id);
			}
			if (!serverQueue.leaveTimeout && members.has(client.user!.id) && members.filter((m) => !m.user.bot).size === 0) setLeaveTimeout(client, serverQueue, music);
		} else if (newChannel.members.has(client.user!.id) && serverQueue.leaveTimeout && member.id !== client.user!.id && serverQueue.songs.length > 0)
			serverQueue.clearLeaveTimeout();

	if (!logs_channel || !logs_channel.isTextBased()) return;
	if (!newState.member || newState.member.user.bot) return;

	let user = `${member.user.tag} (${member.id})`;

	if (!oldChannel && newChannel) logs_channel.send({ embeds: [client.blueEmbed(client.replaceEach(events.voice.joined, { '{user}': user, '{channel}': newChannel.name }))] });
	else if (!newChannel && oldChannel) {
		logs_channel.send({ embeds: [client.redEmbed(client.replaceEach(events.voice.left, { '{user}': user, '{channel}': oldChannel.name }))] });
		if (newState.member.id === client.user!.id && queue.get(oldState.guild.id)) queue.delete(oldState.guild.id);
	} else if (oldChannel && newChannel) {
		logs_channel.send({
			embeds: [client.orangeEmbed(client.replaceEach(events.voice.moved, { '{user}': user, '{oldChannel}': oldChannel.name, '{newChannel}': newChannel.name }))]
		});
		if (newState.member.id === client.user!.id && queue.get(oldState.guild.id)) queue.get(oldState.guild.id)!.voiceChannel = newChannel;
	}
};
