const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
const NodeGeocoder = require('node-geocoder');
const options = {
	provider: 'opencage',
	apiKey: process.env.OPENCAGE_API_KEY
};
module.exports = {
	name: 'location',
	description: 'Search for an ubication in the map',
	ESdesc: 'Busca una ubicación en el mapa',
	usage: 'location <location>',
	example: 'location mamada station',
	aliases: ['map', 'whereis', 'ubication'],
	type: 0,
	async execute(client, message, args) {
		if (!args[0]) return;
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		const geocoder = NodeGeocoder(options);
		const res = await geocoder.geocode(args.join(' '));

		let embed = new MessageEmbed()
			.setTitle(args.join(' '))
			.setColor('RANDOM')
			.setDescription(util.map.found(res, '1'))
			.addField(util.map.country, res[0].country || 'No')
			.addField(util.map.state, res[0].state || 'No')
			.addField(util.map.city, res[0].city || 'No')
			.addField(util.map.zipcode, res[0].zipcode || 'No')
			.addField(util.map.street, res[0].streetName || 'No')
			.setFooter({ text: '1/' + res.length })
			.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${res[0].latitude},${res[0].longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`);
		let msg = await message.channel.send({ embeds: [embed] });

		msg.react('⬅️');
		msg.react('➡️');

		const filter = (reaction, user) => {
			return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		const collector = msg.createReactionCollector({ filter, time: 60000 });
		collector.on('collect', async (reaction) => {
			msg = await message.channel.messages.fetch(msg.id);
			let current = parseInt(msg.embeds[0].footer.text.charAt(0));
			let next = current + 1 > res.length ? res[0] : res[current];
			let previous = current - 1 < 1 ? res[res.length - 1] : res[current - 2];
			let embed;
			switch (reaction.emoji.name) {
				case '➡️':
					embed = new MessageEmbed(msg.embeds[0])
						.setDescription(util.map.found(res, current + 1 > res.length ? 1 : current + 1))
						.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${next.latitude},${next.longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`)
						.setFooter({ text: `${current + 1 > res.length ? 1 : current + 1}/${res.length}` });

					embed.fields[0].value = next.country || 'No';
					embed.fields[1].value = next.state || 'No';
					embed.fields[2].value = next.city || 'No';
					embed.fields[3].value = next.zipcode || 'No';
					embed.fields[4].value = next.streetName || 'No';
					msg.edit({ embeds: [embed] });
					break;
				case '⬅️':
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
					msg.edit({ embeds: [embed] });
					break;
			}
		});
		collector.on('end', () => {
			msg.reactions.removeAll();
		});
	}
};
