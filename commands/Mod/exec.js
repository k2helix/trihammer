const Discord = require('discord.js');


module.exports = {
	name: 'exec',
  description: '',
	async execute(client, message, args) {
        if(message.author.id !== client.config.admin1) return;
        if(message.author.id !== "461279654158925825") return;
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
}