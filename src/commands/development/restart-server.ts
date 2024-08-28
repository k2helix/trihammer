/* eslint-disable @typescript-eslint/no-unused-vars */
import MessageCommand from '../../lib/structures/MessageCommand';
import cp from 'child_process';
export default new MessageCommand({
	name: 'restart-server',
	description: 'only admin',
	category: 'unknown',
	async execute(_client, message) {
		if (message.channelId !== '1252296320912461887') return;

		let content = '**Enviando petición para reiniciar el servidor...**\n';
		let msg = await message.channel.send(content);

		const job = cp.exec('(cd ../mc && docker compose restart)');

		job.stdout!.on('data', (data) => {
			content += `${data}`;
			msg.edit(content);
		});

		job.stderr!.on('data', (data) => {
			content += `${data}`;
			msg.edit(content);
		});

		job.on('close', (code) => {
			if (code == 0) content += `Petición finalizada correctamente`;
			else content += `Petición finalizada con código ${code}`;
			msg.edit(content);
		});
	}
});
