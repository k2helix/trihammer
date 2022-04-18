import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: 'say',
	description: 'Say something',
	aliases: ['decir'],
	category: 'unknown',
	execute(client, message, args) {
		if (!client.config.administrators.includes(message.author.id)) return;
		let sMessage = args.join(' ');
		if (!sMessage) return;
		message.delete().catch((O_o) => {
			console.log(O_o); //grande serafin
		});
		message.channel.send(sMessage);
	}
});
