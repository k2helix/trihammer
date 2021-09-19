const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	ESdesc: 'Recarga un comando',
	type: -1,
	execute(client, message, args) {
		if (!client.config.admins.includes(message.author.id)) return;
		if (!args[0]) return;
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		const commandFolders = fs.readdirSync('./src/commands');
		const folderName = commandFolders.find((folder) => fs.readdirSync(`./src/commands/${folder}`).includes(`${command.name}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	}
};
