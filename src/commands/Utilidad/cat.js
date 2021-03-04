const request = require('node-superfetch');
module.exports = {
	name: 'cat',
	description: 'Random cat image',
	ESdesc: 'Imagen aleatoria de un gato <3',
	usage: 'cat',
	example: 'cat',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://api.thecatapi.com/v1/images/search'); //https://aws.random.cat/meow
		message.channel.send({
			files: [
				{
					attachment: body[0].url
				}
			]
		});
	}
};
