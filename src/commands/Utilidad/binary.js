const binary = require('decode-encode-binary');
module.exports = {
	name: 'binary',
	description: 'Encode or decode binary text',
	ESdesc: 'Codifica o decodifica binario',
	usage: 'binary [decode] <text>',
	example: 'binary hello how are you\n binary decode 01101000 01101111 01101100 01100001',
	type: 1,
	execute(client, message, args) {
		switch (args[0]) {
			case 'decode':
				message.channel.send(binary.decode(args.slice(1).join(' ')));
				break;

			default:
				message.channel.send(binary.encode(args.join(' '), true));
				break;
		}
	}
};
