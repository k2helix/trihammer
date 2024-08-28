/* eslint-disable @typescript-eslint/no-unused-vars */
import MessageCommand from '../../lib/structures/MessageCommand';
import cp from 'child_process';
export default new MessageCommand({
	name: 'gamemode',
	description: 'only admin',
	category: 'unknown',
	required_args: [
		{ index: 0, name: 'mode', type: 'string' },
		{ index: 1, name: 'username', type: 'string' }
	],
	execute(_client, message, args) {
		if (message.channelId !== '1252296320912461887') return;
		if (args[0] == 'creative' || args[0] == '1') return message.channel.send('que te lo crees tú');

		const job = cp.exec(`docker exec mc-mc-1 rcon-cli gamemode ${args[0]} ${args[1]}`);

		job.on('close', (code) => {
			if (code == 0) message.channel.send(`Modo de juego de ${args[1]} cambiado a ${args[0]}`);
			else message.channel.send('Ocurrió un error cambiando el modo de juego');
		});
	}
});
