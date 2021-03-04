const request = require('node-superfetch');
module.exports = {
	name: 'bird',
	description: 'Bird random image',
	ESdesc: 'Imagen aleatoria de un pájaro',
	usage: 'bird',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		if (!message.member.hasPermission('ATTACH_FILES')) return;
		const { body } = await request.get('https://shibe.online/api/birds').query({
			count: 1,
			urls: true,
			httpsUrls: true
		});
		message.channel.send({
			files: [
				{
					attachment: body[0]
				}
			]
		});
	}
};
