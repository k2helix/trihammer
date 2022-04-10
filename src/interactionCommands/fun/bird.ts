const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'bird',
	description: 'Bird random image',
	ESdesc: 'Imagen aleatoria de un pájaro',
	usage: 'bird',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES))
			return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://shibe.online/api/birds').query({
			count: 1,
			urls: true,
			httpsUrls: true
		});
		interaction.reply({
			files: [
				{
					attachment: body[0]
				}
			]
		});
	}
};
