module.exports = {
	name: 'say',
	description: 'Say something',
	ESdesc: 'Haz que el bot diga algo',
	usage: 'say <text>',
	example: 'say hello',
	aliases: ['decir'],
	type: 7,
	execute(client, message, args) {
		if (message.member.id !== '461279654158925825') return message.channel.send('Admin only');
		let sMessage = args.join(' ');
		if (!sMessage) return;
		message.delete().catch((O_o) => {
			console.log(O_o);
		});
		message.channel.send(sMessage);
	}
};
