const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'koala',
	description: 'Random koala image',
	ESdesc: 'Imagen aleatoria de un koala',
	usage: 'koala',
	example: 'koala',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES)) return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://some-random-api.ml/img/koala');
		interaction.reply({
			files: [
				{
					attachment: body.link
				}
			]
		});
	}
};
