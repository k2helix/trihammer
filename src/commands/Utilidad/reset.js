let request = require('node-superfetch');
module.exports = {
	name: 'reset',
	description: 'Resets the bot',
	ESdesc: 'Resetea el bot',
	aliases: ['restart'],
	type: -1,
	async execute(client, message) {
		if (!client.config.admins.includes(message.author.id)) return;
		message.channel.send('Restarting...');
		await request.delete('https://api.heroku.com/apps/trihammer/dynos/worker', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.heroku+json; version=3',
				authorization: 'Bearer ' + process.env.HEROKU_TOKEN
			}
		});
	}
};
