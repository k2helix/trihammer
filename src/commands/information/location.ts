import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
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
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const geocoder = NodeGeocoder(options);
		const res = await geocoder.geocode(args.join(' '));

		const row = new MessageActionRow().addComponents([
			new MessageButton().setCustomId('left').setEmoji('882626242459861042').setStyle('PRIMARY'),
			new MessageButton().setCustomId('right').setEmoji('882626290253959258').setStyle('PRIMARY'),
			new MessageButton().setCustomId('zoomin').setEmoji('964842455390375957').setStyle('PRIMARY'),
			new MessageButton().setCustomId('zoomout').setEmoji('964842968815116369').setStyle('PRIMARY')
		]);

		let embed = new MessageEmbed()
			.setTitle(args.join(' '))
			.setColor('RANDOM')
			.setDescription(util.map.found(res, '1'))
			// @ts-ignore it exists indeed
			.addField(util.map.country, res[0].country || 'No')
			.addField(util.map.state, res[0].state || 'No')
			.addField(util.map.city, res[0].city || 'No')
			.addField(util.map.zipcode, res[0].zipcode || 'No')
			.addField(util.map.street, res[0].streetName || 'No')
			.setFooter({ text: '1/' + res.length })
			// yeah this leaks the api key but who cares
			.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${res[0].latitude},${res[0].longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`);
		let msg = await message.channel.send({ embeds: [embed], components: [row] });

		const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
		const collector = msg.createMessageComponentCollector({ filter, time: 60000, componentType: 'BUTTON' });
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
					embed = new MessageEmbed(msg.embeds[0])
						.setDescription(util.map.found(res, current + 1 > res.length ? 1 : current + 1))
						.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${next.latitude},${next.longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`)
						.setFooter({ text: `${current + 1 > res.length ? 1 : current + 1}/${res.length}` });

					embed.fields[0].value = next.country || 'No';
					embed.fields[1].value = next.state || 'No';
					embed.fields[2].value = next.city || 'No';
					embed.fields[3].value = next.zipcode || 'No';
					embed.fields[4].value = next.streetName || 'No';
					reaction.update({ embeds: [embed] });
					break;
				case 'left':
					embed = new MessageEmbed(msg.embeds[0])
						.setDescription(util.map.found(res, current - 1 < 1 ? res.length : current - 1))
						.setImage(
							`https://open.mapquestapi.com/staticmap/v5/map?locations=${previous.latitude},${previous.longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`
						)
						.setFooter({ text: `${current - 1 < 1 ? res.length : current - 1}/${res.length}` });

					embed.fields[0].value = previous.country || 'No';
					embed.fields[1].value = previous.state || 'No';
					embed.fields[2].value = previous.city || 'No';
					embed.fields[3].value = previous.zipcode || 'No';
					embed.fields[4].value = previous.streetName || 'No';
					reaction.update({ embeds: [embed] });
					break;
				case 'zoomin':
					if (zoomIn > 20) return reaction.reply({ embeds: [client.redEmbed(util.map.too_much_zoom)], ephemeral: true });
					embed = new MessageEmbed(msg.embeds[0]).setImage(currentImage.replace(`&zoom=${currentZoom}`, `&zoom=${zoomIn}`));
					reaction.update({ embeds: [embed] });
					break;
				case 'zoomout':
					if (zoomOut < 0) return reaction.reply({ embeds: [client.redEmbed(util.map.too_little_zoom)], ephemeral: true });
					embed = new MessageEmbed(msg.embeds[0]).setImage(currentImage.replace(`&zoom=${currentZoom}`, `&zoom=${zoomOut}`));
					reaction.update({ embeds: [embed] });
					break;
			}
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
});
