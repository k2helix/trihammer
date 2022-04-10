let { ModelUsers } = require('../../lib/utils/models');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	ESdesc: 'Ping!',
	usage: 'Ping!',
	example: 'Ping!',
	type: 0,
	async execute(client, interaction) {
		interaction.reply('Pinging...');
		let sent = await interaction.fetchReply();
		let content = `Pong! ${sent.createdTimestamp - interaction.createdTimestamp}ms`;
		if (interaction.options.getBoolean('advanced')) {
			await ModelUsers.findOne({ id: interaction.user.id });
			content += `\nMongoDB Ping: ${Date.now() - sent.createdTimestamp}ms\nWebsocket: ${client.ws.ping}`;
		}
		interaction.editReply(content);
	}
};
