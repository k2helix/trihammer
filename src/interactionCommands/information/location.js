const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
	async execute(client, interaction, guildConf) {
		let { util, music } = require(`../../utils/lang/${guildConf.lang}.js`);

		const geocoder = NodeGeocoder(options);
		let location = interaction.options.getString('query');
		const res = await geocoder.geocode(location);
		if (!res[0]) interaction.reply({ content: music.not_found, ephemeral: true });

		const row = new MessageActionRow().addComponents([
			new MessageButton().setCustomId('left').setEmoji('882626242459861042').setStyle('PRIMARY'),
			new MessageButton().setCustomId('right').setEmoji('882626290253959258').setStyle('PRIMARY')
		]);
		let embed = new MessageEmbed()
			.setTitle(location)
			.setColor('RANDOM')
			.setDescription(util.map.found(res, '1'))
			.addField(util.map.country, res[0].country || 'No')
			.addField(util.map.state, res[0].state || 'No')
			.addField(util.map.city, res[0].city || 'No')
			.addField(util.map.zipcode, res[0].zipcode || 'No')
			.addField(util.map.street, res[0].streetName || 'No')
			.setFooter({ text: '1/' + res.length })
			.setImage(`https://open.mapquestapi.com/staticmap/v5/map?locations=${res[0].latitude},${res[0].longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`);
		interaction.reply({ embeds: [embed], components: [row] });
		let msg = await interaction.fetchReply();

		const filter = (int) => int.user.id === interaction.user.id;
		const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
		collector.on('collect', async (reaction) => {
			msg = await interaction.channel.messages.fetch(msg.id);
			let current = parseInt(msg.embeds[0].footer.text.charAt(0));
			let next = current + 1 > res.length ? res[0] : res[current];
			let previous = current - 1 < 1 ? res[res.length - 1] : res[current - 2];
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
			}
		});
		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	}
};
