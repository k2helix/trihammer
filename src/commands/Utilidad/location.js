const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
const { get } = require('node-superfetch');
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
		let { body } = await get(
			`https://open.mapquestapi.com/staticmap/v5/map?locations=${res[0].latitude},${res[0].longitude}&size=600,400&key=${process.env.MAPQUEST_API_KEY}&zoom=5`
		);
		let embed = new MessageEmbed()
			.setTitle(args.join(' '))
			.setColor('RANDOM')
			.addField(util.map.country, res[0].country || 'No')
			.addField(util.map.state, res[0].state || 'No')
			.addField(util.map.city, res[0].city || 'No')
			.addField(util.map.zipcode, res[0].zipcode || 'No')
			.addField(util.map.street, res[0].streetName || 'No')

			.attachFiles([{ name: 'map.jpg', attachment: body }])
			.setImage('attachment://map.jpg');
		message.channel.send(embed);
	}
};
