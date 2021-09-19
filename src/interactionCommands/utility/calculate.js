const math = require('mathjs');
module.exports = {
	name: 'calculate',
	description: 'Calculate the given expresion',
	ESdesc: 'Calcula la expresión dada',
	usage: 'calc <expr>',
	example: 'calc 123+34\ncalc 100/50\ncalc 2^2\ncalc 5x23',
	aliases: ['calcular', 'calculadora', 'calculate', 'calcula', 'calcul'],
	type: 1,
	execute(client, interaction) {
		let resp;
		try {
			resp = math.evaluate(interaction.options.getString('expression').replace('x', '*'));
		} catch (e) {
			return;
		}
		if (resp === Infinity) resp = ':ok_hand:';
		interaction.reply(resp.toString());
	}
};
