const request = require('node-superfetch');
module.exports = {
	name: 'panda',
	description: 'Random panda image',
	ESdesc: 'Imagen aleatoria de un panda',
	usage: 'panda [red]',
	example: 'panda red\npanda',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get(args[0] === 'red' ? 'https://some-random-api.ml/img/red_panda' : 'https://some-random-api.ml/img/panda');
		message.channel.send({
			files: [
				{
					attachment: body.link
				}
			]
		});
	}
};
