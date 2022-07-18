import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeGeocoder = require('node-geocoder');
const options = {
	provider: 'opencage',
	apiKey: process.env.OPENCAGE_API_KEY
};
export default new MessageCommand({
	name: 'location',
	description: 'Search for a location in the map',
	aliases: ['map', 'whereis', 'ubication'],
	category: 'utility',
	required_args: [{ index: 0, name: 'location query', type: 'string' }],
	async execute(client, message, args, guildConf) {
		const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const geocoder = NodeGeocoder(options);
		const res = await geocoder.geocode(args.join(' '));

		if (!res[0]) return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder().setCustomId('left').setEmoji({ id: '882626242459861042' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('right').setEmoji({ id: '882626290253959258' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('zoomin').setEmoji({ id: '964842455390375957' }).setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('zoomout').setEmoji({ id: '964842968815116369' }).setStyle(ButtonStyle.Primary)
		]);

		let embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(util.map.found(res, '1'))
			.addFields(
				{ name: util.map.country, value: res[0].country || 'No' },
				{ name: util.map.state, value: res[0].state || 'No' },
				{ name: util.map.city, value: res[0].city || 'No' },
				{ name: util.map.zipcode, value: res[0].zipcode || 'No' },
				{ name: util.map.street, value: res[0].streetName || 'No' }
			)
			.setFooter({ text: '1/' + res.length })
			// yeah this leaks the api key but who cares
			.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${res[0].latitude},${res[0].longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`);
		let msg = await message.channel.send({ embeds: [embed], components: [row] });

		const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
		const collector = msg.createMessageComponentCollector({ filter, time: 60000, componentType: ComponentType.Button });
		// @ts-ignore
		collector.on('collect', async (reaction) => {
			msg = await message.channel.messages.fetch(msg.id);
			let current = parseInt(msg.embeds[0].footer!.text.charAt(0));
			let next = current + 1 > res.length ? res[0] : res[current];
			let previous = current - 1 < 1 ? res[res.length - 1] : res[current - 2];
			let currentImage = msg.embeds[0].image!.url;
			let currentZoom = currentImage.slice(currentImage.indexOf('&zoom=') + 6);
			let zoomIn = parseInt(currentZoom) + 1,
				zoomOut = parseInt(currentZoom) - 1;
			let embed;
			switch (reaction.customId) {
				case 'right':
					embed = EmbedBuilder.from(msg.embeds[0])
						.setDescription(util.map.found(res, current + 1 > res.length ? 1 : current + 1))
						.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${next.latitude},${next.longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`)
						.setFields(
							{ name: util.map.country, value: next.country || 'No' },
							{ name: util.map.state, value: next.state || 'No' },
							{ name: util.map.city, value: next.city || 'No' },
							{ name: util.map.zipcode, value: next.zipcode || 'No' },
							{ name: util.map.street, value: next.streetName || 'No' }
						)
						.setFooter({ text: `${current + 1 > res.length ? 1 : current + 1}/${res.length}` });

					reaction.update({ embeds: [embed] });
					break;
				case 'left':
					embed = EmbedBuilder.from(msg.embeds[0])
						.setDescription(util.map.found(res, current - 1 < 1 ? res.length : current - 1))
						.setImage(
							`https://open.mapquestapi.com/staticmap/v5/map?locations=${previous.latitude},${previous.longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`
						)
						.setFields(
							{ name: util.map.country, value: previous.country || 'No' },
							{ name: util.map.state, value: previous.state || 'No' },
							{ name: util.map.city, value: previous.city || 'No' },
							{ name: util.map.zipcode, value: previous.zipcode || 'No' },
							{ name: util.map.street, value: previous.streetName || 'No' }
						)
						.setFooter({ text: `${current - 1 < 1 ? res.length : current - 1}/${res.length}` });

					reaction.update({ embeds: [embed] });
					break;
				case 'zoomin':
					if (zoomIn > 20) return reaction.reply({ embeds: [client.redEmbed(util.map.too_much_zoom)], ephemeral: true });
					embed = EmbedBuilder.from(msg.embeds[0]).setImage(currentImage.replace(`&zoom=${currentZoom}`, `&zoom=${zoomIn}`));
					reaction.update({ embeds: [embed] });
					break;
				case 'zoomout':
					if (zoomOut < 0) return reaction.reply({ embeds: [client.redEmbed(util.map.too_little_zoom)], ephemeral: true });
					embed = EmbedBuilder.from(msg.embeds[0]).setImage(currentImage.replace(`&zoom=${currentZoom}`, `&zoom=${zoomOut}`));
					reaction.update({ embeds: [embed] });
					break;
			}
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
});
