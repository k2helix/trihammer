module.exports = {
	name: 'getCommands',
	description: 'only admin',
	ESdesc: 'SOLO ADMIN DIJE',
	usage: 'only admin',
	example: 'only admin',
	type: -1,
	execute(client, message) {
		if (!client.config.admins.includes(message.author.id)) return;
		let array = [];
		client.commands.forEach((command) => {
			array.push({ name: command.name, description: command.description });
			// eslint-disable-next-line prettier/prettier
			if (array.length === client.commands.size) message.channel.send({ files: [{attachment: Buffer.from(JSON.stringify(array)), name: 'commands.txt'}] });
		});
	}
};
