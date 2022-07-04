import { ModelServer, Server } from '../lib/utils/models';
import { queue } from '../lib/modules/music';
import ExtendedClient from '../lib/structures/Client';
import { VoiceState } from 'discord.js';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { getVoiceConnection } from '@discordjs/voice';
import { Queue } from '../lib/structures/interfaces/MusicInterfaces';

function setLeaveTimeout(client: ExtendedClient, serverQueue: Queue, music: LanguageFile['music']) {
	serverQueue.leaveTimeout = setTimeout(() => {
		serverQueue.songs = [];
		getVoiceConnection(serverQueue.voiceChannel.guildId!)!.destroy();
		queue.delete(serverQueue.voiceChannel.guild.id);
		serverQueue!.textChannel.send({ embeds: [client.redEmbed(music.leave_timeout)] });
	}, 60000);
}

function clearLeaveTimeout(serverQueue: Queue) {
	clearTimeout(serverQueue.leaveTimeout!);
	serverQueue.leaveTimeout = null;
}

export default async (client: ExtendedClient, oldState: VoiceState, newState: VoiceState) => {
	const serverConfig: Server = await ModelServer.findOne({ server: oldState.guild.id }).lean();
	if (!serverConfig) return;

	let logs_channel = oldState.guild.channels.cache.get(serverConfig.voicelogs);
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;

	const { music, events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;
	let member = newState.member!;

	let serverQueue = queue.get(oldState.guild.id);
	if (serverQueue && serverQueue.voiceChannel.id === (oldChannel || newChannel)!.id)
		if (!newChannel) {
			let members = oldChannel!.members;
			if (member.id === client.user!.id) return queue.delete(oldState.guild.id); // if the bot was disconnected
			if (serverQueue.leaveTimeout) return;
			if (members.has(client.user!.id) && members.filter((m) => !m.user.bot).size < 1) setLeaveTimeout(client, serverQueue, music);
		} else if (newChannel.members.has(client.user!.id) && serverQueue.leaveTimeout && member.id !== client.user!.id && serverQueue.songs.length > 0)
			clearLeaveTimeout(serverQueue);
		else if (member.id === client.user!.id && newChannel && oldChannel) {
			serverQueue.voiceChannel = newChannel;
			if (serverQueue.leaveTimeout && newChannel.members!.filter((m) => !m.user.bot).size > 0) clearLeaveTimeout(serverQueue);
			else if (!serverQueue.leaveTimeout && newChannel.members!.filter((m) => !m.user.bot).size === 0) setLeaveTimeout(client, serverQueue, music);
		}

	if (!logs_channel || !logs_channel.isText()) return;
	if (!newState.member || newState.member.user.bot) return;

	let user = `${newState.member.user.tag} (${newState.id})`;

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
