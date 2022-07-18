import { ChatInputCommandInteraction, GuildBasedChannel } from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ModelWelc } from '../../lib/utils/models';
export default new Command({
	name: 'wchannel',
	description: 'Set the welcome channel',
	category: 'configuration',
	required_perms: ['Administrator'],
	required_roles: ['ADMINISTRATOR'],
	async execute(client, interaction, guildConf) {
		const { config } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		let channel = (interaction as ChatInputCommandInteraction).options.getChannel('channel')! as GuildBasedChannel;
		if (!channel.isTextBased()) return interaction.reply({ embeds: [client.redEmbed(config.only_text)], ephemeral: true });

		let welcome = await ModelWelc.findOne({ server: interaction.guildId });
		if (!welcome) {
			let newModel = new ModelWelc({
				server: interaction.guildId,
				canal: channel.id,
				color: '#ffffff',
				image: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
				text: `Welcome to ${interaction.guild!.name}`
			});
			welcome = newModel;
		}
		welcome.canal = channel.id;
		await welcome.save();
		interaction.reply({ embeds: [client.blueEmbed(config.channel_set.welcome.replace('{channel}', `<#${channel.id}>`))] });
	}
});
