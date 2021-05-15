const request = require('node-superfetch');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'world',
	description: "Let's ChangeIt!",
	ESdesc: '¡Vamos a cambiarlo!',
	usage: 'world',
	example: 'world',
	type: 1,
	async execute(client, message) {
		let msg = await message.channel.send('Loading...');
		let { text } = await request.get(
			'https://api.scraperapi.com?api_key=d4200ce7de524ce498e47c883cace088&render=true&url=https://www.worldometers.info/'
		);

		let $ = cheerio.load(text);
		let numbers = $('div[class="counter-group"]');
		let array = [];
		Object.keys(numbers).forEach((key) => {
			let n = numbers[key];
			if (!n.attribs) return;
			let objId = n.attribs.id;
			if (!objId.includes('c')) return;
			let counter = n.children[0].children[1].children[0].children;
			if (!counter) return;
			let id = n.children[1] ? n.children[1].attribs.id : null;
			let e12 = counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e12')
				? counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e12').children[0].data
				: '';
			let e9 = counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e9')
				? counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e9').children[0].data
				: '';
			let e6 = counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e6')
				? counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e6').children[0].data
				: '';
			let e3 = counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e3')
				? counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e3').children[0].data
				: '';
			let e0 = counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e0')
				? counter.find((nu) => nu.attribs.class === 'rts-nr-int rts-nr-10e0').children[0].data
				: '';
			let obj = {
				objId: objId,
				id: id,
				count: `${e12 ? e12 + ',' : ''}${e9 ? e9 + ',' : ''}${e6 ? e6 + ',' : ''}${e3 ? e3 + ',' : ''}${e0}`
			};
			array.push(obj);
		});

		let embed = new MessageEmbed()
			.setTitle('World Information')
			.setColor('RANDOM')
			.addField(
				'**ENERGY**\nEnergy used today',
				`${array.find((o) => o.id === 'energy_used').count} MWh (${array.find((o) => o.id === 'energy_nonren').count} from non-renewable sources)`
			)
			.addField('Solar energy striking Earth', array.find((o) => o.id === 'solar_energy').count + ' MWh')
			.addField('Oil pumped today (barrels)', array.find((o) => o.id === 'oil_consumption').count)
			.addField(
				'Oil left (barrels)',
				array.find((o) => o.id === 'oil_reserves').count +
					` (~${array.find((o) => o.id === 'oil_days').count} days = ${Math.floor(
						parseInt(array.find((o) => o.id === 'oil_days').count.replace(',', '')) / 365.25
					)} years)`
			)
			.addField('Natural gas left (barrels of oil equivalent)', array.find((o) => o.id === 'gas_reserves').count)
			.addField('Coal left (boe)', array.find((o) => o.id === 'coal_reserves').count)
			.addField('**--------------------**', '** **')
			.addField('**ENVIRONMENT**\nForest loss this year', array.find((o) => o.id === 'forest_loss').count + ' hectares')
			.addField('Land lost to soil erosion this year', array.find((o) => o.id === 'soil_erosion').count + ' ha')
			.addField('CO2 emissions this year', array.find((o) => o.id === 'co2_emissions').count + ' tons')
			.addField('Desertification this year', array.find((o) => o.id === 'desert_land_formed').count + ' hectares')
			.setDescription(
				'This stats belong to [WorldoMeters](https://www.worldometers.info/). If you want to help reducing this, you can download [ChangeIt](https://changeit.app/) on your phone. This app helps you by sharing with you small actions you can start doing now to reduce your carbon footprint.'
			);

		message.channel.send(embed);
		msg.delete();
	}
};
