import { evaluate } from 'mathjs';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'calc',
	description: 'Calculate the given expresion',
	aliases: ['calcular', 'calculadora', 'calculate', 'calcula', 'calcul'],
	category: 'utility',
	required_args: [{ index: 0, name: 'expression', type: 'string' }],
	execute(_client, message, args) {
		let resp;
		try {
			resp = evaluate(args.join(' ').replace('x', '*'));
		} catch (e) {
			return;
		}
		if (resp === Infinity) resp = ':ok_hand:';
		message.channel.send(resp.toString());
	}
});
