/* eslint-disable @typescript-eslint/no-unused-vars */
import MessageCommand from '../../lib/structures/MessageCommand';
import cp from 'child_process';
export default new MessageCommand({
	name: 'sendmsg',
	description: 'only admin',
	category: 'unknown',
	execute(_client, message) {
		if (message.channelId !== '1252296320912461887') return;

		cp.exec(`docker exec mc-mc-1 rcon-cli tellraw @a '"[Discord] <${message.author.username}> ${message.content}"'`);
	}
});
