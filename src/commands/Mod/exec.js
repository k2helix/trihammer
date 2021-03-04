module.exports = {
	name: 'exec',
	description: 'only admin',
	ESdesc: 'only admin',
	type: -1,
	execute(client, message, args) {
		if (!client.config.admins.includes(message.author.id)) return;
		const cp = require('child_process');
		const job = cp.exec(args.join(' '));
		job.stdout.on('data', (data) => {
			message.channel.send(`stdout: ${data}`);
		});

		job.stderr.on('data', (data) => {
			message.channel.send(`stderr: ${data}`);
		});

		job.on('close', (code) => {
			message.channel.send(`child process exited with code ${code}`);
		});
	}
};
