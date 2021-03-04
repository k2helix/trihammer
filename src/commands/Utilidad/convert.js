const math = require('mathjs');
function formatNumber(number, minimumFractionDigits = 0) {
	return Number.parseFloat(number).toLocaleString(undefined, {
		minimumFractionDigits,
		maximumFractionDigits: 2
	});
}
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'convert',
	description: 'Convert units to other units',
	ESdesc: 'Convierte unidades en otras unidades',
	usage: 'convert <amount> <base unit> <target unit>',
	example: 'convert 10 m cm',
	aliases: ['units', 'conver-units'],
	type: 1,
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const amount = args[0];
		const base = args[1];
		const target = args[2];

		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		let prefix = serverConfig.prefix;
		if (!amount) return message.channel.send(util.convert.need.replace('{prefix}', prefix));
		try {
			const value = math.unit(amount, base).toNumber(target);

			let obj = {
				'{amount}': formatNumber(amount),
				'{base}': base,
				'{number}': formatNumber(value),
				'{target}': target
			};
			let msg = util.convert.success.replaceAll(obj);
			return message.channel.send(msg);
		} catch (error) {
			message.channel.send(error.message);
		}
	}
};
