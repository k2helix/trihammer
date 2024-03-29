import Command from '../../lib/structures/Command';

export default new Command({
	name: 'invite',
	description: 'Invite the bot to your server',
	category: 'information',
	execute(client, interaction, guildConf) {
		client.interactionCommands.get('bot-info')!.execute(client, interaction, guildConf);
	}
});
