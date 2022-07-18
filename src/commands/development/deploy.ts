import { ApplicationCommandDataResolvable } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'deploy',
	description: 'only admin',
	category: 'unknown',
	async execute(client, message) {
		if (!client.config.administrators.includes(message.author.id)) return;
		const data = (await import(`../../interactionCommands/commands`)).default;
		const commands = await client.application?.commands.set(data as ApplicationCommandDataResolvable[]);
		console.log(commands);
	}
});
