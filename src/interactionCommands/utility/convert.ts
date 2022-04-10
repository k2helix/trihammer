const math = require('mathjs');
function formatNumber(number, minimumFractionDigits = 0) {
	return Number.parseFloat(number).toLocaleString(undefined, {
		minimumFractionDigits,
		maximumFractionDigits: 2
	});
}
module.exports = {
	name: 'convert',
	description: 'Convert units to other units',
	ESdesc: 'Convierte unidades en otras unidades',
	usage: 'convert <amount> <base unit> <target unit>',
	example: 'convert 10 m cm',
	aliases: ['units', 'conver-units'],
	type: 1,
	execute(client, interaction, guildConf) {
		const amount = interaction.options.getString('amount');
		const base = interaction.options.getString('base-unit');
		const target = interaction.options.getString('target-unit');

		let { util } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!amount) return interaction.reply({ content: util.convert.need.replace('{prefix}', guildConf.prefix), ephemeral: true });
		try {
			const value = math.unit(amount, base).toNumber(target);

			let obj = {
				'{amount}': formatNumber(amount),
				'{base}': base,
				'{number}': formatNumber(value),
				'{target}': target
			};
			let msg = util.convert.success.replaceAll(obj);
			return interaction.reply(msg);
		} catch (error) {
			interaction.reply({ content: error.message, ephemeral: true });
		}
	}
};
