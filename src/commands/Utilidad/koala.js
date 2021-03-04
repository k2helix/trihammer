const request = require('node-superfetch');
module.exports = {
	name: 'koala',
	description: 'Random koala image',
	ESdesc: 'Imagen aleatoria de un koala',
	usage: 'koala',
	example: 'koala',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://some-random-api.ml/img/koala');
		message.channel.send({
			files: [
				{
					attachment: body.link
				}
			]
		});
	}
};
