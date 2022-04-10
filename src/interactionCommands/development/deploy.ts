module.exports = {
	name: 'deploy',
	description: 'only admin',
	ESdesc: 'SOLO ADMIN DIJE',
	usage: 'only admin',
	example: 'only admin',
	type: -1,
	async execute(client, message) {
		if (!client.config.admins.includes(message.author.id)) return;
		const data = require('../../../commands');
		const commands = await client.application?.commands.set(data);
		console.log(commands);
	}
};
