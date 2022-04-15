import MessageCommand from '../../lib/structures/MessageCommand';
import cp from 'child_process';
export default new MessageCommand({
	name: 'exec',
	description: 'only admin',
	category: 'unknown',
	execute(client, message, args) {
		if (!client.config.administrators.includes(message.author.id)) return;
		const job = cp.exec(args.join(' '));
		job.stdout!.on('data', (data) => {
			message.channel.send(`stdout: ${data}`);
		});

		job.stderr!.on('data', (data) => {
			message.channel.send(`stderr: ${data}`);
		});

		job.on('close', (code) => {
			message.channel.send(`child process exited with code ${code}`);
		});
	}
});
