const request = require('node-superfetch');
module.exports = {
	name: 'fox',
	description: 'Random fox image',
	ESdesc: 'Imagen aleatoria de un zorro',
	usage: 'fox',
	example: 'fox',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://randomfox.ca/floof/');
		message.channel.send({
			files: [
				{
					attachment: body.image
				}
			]
		});
	}
};
