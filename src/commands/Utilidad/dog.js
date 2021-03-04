const request = require('node-superfetch');
module.exports = {
	name: 'dog',
	description: 'Random dog image',
	ESdesc: 'Imagen aleatoria de un perro',
	usage: 'dog',
	example: 'dog',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		message.channel.send({
			files: [
				{
					attachment: body.message
				}
			]
		});
	}
};
