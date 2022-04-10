module.exports = {
	name: 'binary',
	description: 'Encode or decode binary text',
	ESdesc: 'Codifica o decodifica binario',
	usage: 'binary [decode] <text>',
	example: 'binary hello how are you\n binary decode 01101000 01101111 01101100 01100001',
	type: 1,
	execute(client, interaction) {
		switch (interaction.options.getString('action')) {
			case 'decode_binary':
				interaction.reply(binary.decode(interaction.options.getString('text')));
				break;

			default:
				interaction.reply(binary.encode(interaction.options.getString('text'), true));
				break;
		}
	}
};
