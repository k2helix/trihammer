import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
export default new MessageCommand({
	name: 'reset',
	description: 'Resets the bot',
	aliases: ['restart'],
	category: 'unknown',
	async execute(client, message) {
		if (!process.env.HEROKU_TOKEN) return;
		if (!client.config.administrators.includes(message.author.id)) return;
		message.channel.send('Restarting...');
		await request.delete({
			url: 'https://api.heroku.com/apps/trihammer/dynos/worker',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.heroku+json; version=3',
				authorization: 'Bearer ' + process.env.HEROKU_TOKEN
			}
		});
	}
});
