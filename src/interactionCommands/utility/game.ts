// @ts-nocheck
import request from 'node-superfetch';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	MessageCreateOptions,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from 'discord.js';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

const languages = {
	es: 'spanish',
	en: 'english'
};

export default new Command({
	name: 'game',
	description: 'Search for a game in Steam',
	cooldown: 5,
	category: 'utility',
	async execute(client, interaction, guildConf) {
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		await interaction.deferReply();

		try {
			let steamGame = (interaction as ChatInputCommandInteraction).options.getString('query')!;
			let result = await request.get(`https://store.steampowered.com/api/storesearch/?term=${steamGame}&l=english&cc=US`);
			if (result.body.total == 0) return interaction.editReply({ embeds: [client.redEmbed(util.game.not_found)] });

			let appId;
			if ((interaction as ChatInputCommandInteraction).options.getBoolean('confirm-result')) {
				let options = [];
				for (let index = 0; index < result.body.items.length; index++) {
					const element = result.body.items[index];
					options.push({ label: `${index + 1}- ${element.name}`.slice(0, 99), value: element.id.toString() });
				}

				const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder().setCustomId('game').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
				);

				let embedSearch = new EmbedBuilder()
					.setTitle(util.image.title)
					.setColor('Random')
					.setDescription(
						`${result.body.items
							.map((res) => `**${result.body.items.findIndex((x) => x.id === res.id) + 1} -** [${res.name}](https://store.steampowered.com/app/${res.id})`)
							.join('\n')}\n ${util.anime.type_a_number}`
					);

				let msg = await interaction.channel!.send({ embeds: [embedSearch], components: [row] });
				const filter = (int: StringSelectMenuInteraction) => int.customId === 'game' && int.user.id === interaction.user.id;
				try {
					let selected = await msg.awaitMessageComponent({ filter, time: 15000, componentType: ComponentType.SelectMenu });
					appId = selected.values[0];
					msg.delete();
				} catch (error) {
					if (interaction.replied || interaction.deferred) interaction.editReply({ content: music.cancel });
					else interaction.reply({ content: music.cancel, ephemeral: true });
					return msg.delete();
				}
			} else appId = result.body.items[0].id;

			let { body } = await request.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=${languages[guildConf.lang as 'es' | 'en']}`);
			let data = body[appId].data;
			let steamDLCs: string[] = [];

			let embed = new EmbedBuilder()
				.setTitle(data.name)
				.setDescription(data.short_description)
				.setImage(data.header_image)
				.setColor('Random')
				.addFields(
					{ name: util.game.release, value: data.release_date.date, inline: true },
					{ name: util.game.genres, value: data.genres.map((g) => g.description).join(', '), inline: true },
					{ name: '​', value: '​', inline: true },
					{ name: util.game.price, value: data.is_free ? '$0.00' : data.price_overview?.final_formatted || '???', inline: true },
					{ name: util.game.publishers, value: data.publishers.join(', ') || 'No', inline: true },
					{ name: '​', value: '​', inline: true }
				)
				.setFooter({ text: 'Steam Store' });

			let info: MessageCreateOptions = { embeds: [embed] };
			let row: ActionRowBuilder<ButtonBuilder>;

			if (data.dlc) {
				row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('dlcs').setLabel(util.game.show_dlcs).setStyle(ButtonStyle.Primary));
				info.components = [row];
			}
			interaction.editReply(info);

			if (info.components) {
				let msg = await interaction.fetchReply();
				const filter = (int: ButtonInteraction) => int.user.id === interaction.user.id;
				const collector = msg.createMessageComponentCollector({ filter, time: 30000, componentType: ComponentType.Button });
				collector.on('collect', async (reaction) => {
					for (let index = 0; index < data.dlc.length; index++)
						if (index <= 3) {
							const dlcId = data.dlc[index];
							let dlc = (await request.get('https://store.steampowered.com/api/appdetails?appids=' + dlcId)).body[dlcId].data;
							steamDLCs.push(`${dlc.name} (${dlc.is_free ? '$0.00' : dlc.price_overview?.final_formatted || '???'})`);
						}
					// for some reason here msg.embeds is empty
					reaction.update({
						embeds: [
							embed.addFields({
								name: 'DLCs',
								value: `${steamDLCs.join('\n') || 'No'}${data.dlc.length > 3 ? `\n${data.dlc.length - 3} more...` : ''}`,
								inline: false
							})
						],
						components: []
					});
					collector.stop('Button pressed');
				});
				collector.on('end', () => {
					if (collector.endReason !== 'Button pressed') msg.edit({ components: [] }).catch(() => null);
				});
			}
		} catch (err) {
			console.log(err);
			return interaction.editReply({ embeds: [client.redEmbed(util.game.not_found)] });
		}
	}
});
