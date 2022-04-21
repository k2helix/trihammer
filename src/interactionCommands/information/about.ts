import Command from '../../lib/structures/Command';

export default new Command({
	name: 'about',
	description: 'Get info about the bot',
	category: 'information',
	execute(client, interaction, guildConf) {
		client.interactionCommands.get('bot-info')!.execute(client, interaction, guildConf);
	}
});
