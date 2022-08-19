import MessageCommand from '../../lib/structures/MessageCommand';
import commands from '../../interactionCommands/commands';
export default new MessageCommand({
	name: 'deploy',
	description: 'only admin',
	category: 'unknown',
	async execute(client, message) {
		if (!client.config.administrators.includes(message.author.id)) return;
		const deployedCommands = await client.application?.commands.set(commands);
		console.log(deployedCommands);
	}
});
