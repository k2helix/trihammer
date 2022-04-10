const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'panda',
	description: 'Random panda image',
	ESdesc: 'Imagen aleatoria de un panda',
	usage: 'panda [red]',
	example: 'panda red\npanda',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES))
			return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://some-random-api.ml/img/panda');
		interaction.reply({
			files: [
				{
					attachment: body.link
				}
			]
		});
	}
};
