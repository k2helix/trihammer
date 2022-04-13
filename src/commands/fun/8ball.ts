import MessageCommand from '../../lib/structures/MessageCommand';

export default new MessageCommand({
	name: '8ball',
	description: 'Hecho para mi padre que siempre duda.',
	category: 'unknown',
	execute(_client, message, args) {
		if (!args[0]) return;
		let answers = [
			'No lol',
			'Claro que sí bro',
			'Me parece correcto',
			'Totalmente de acuerdo',
			'Definitivamente no.',
			'Deberías hacer lo que quieras, estoy de tu lado, y solo del tuyo.',
			'Los espíritus menores dicen que no.'
		];
		message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
	}
});
