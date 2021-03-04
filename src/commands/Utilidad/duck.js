const request = require('node-superfetch');
module.exports = {
	name: 'duck',
	description: 'Random duck image',
	ESdesc: 'Imagen aleatoria de un pato',
	usage: 'duck',
	example: 'duck',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		message.channel.send({
			files: [
				{
					attachment: body.url
				}
			]
		});
	}
};
