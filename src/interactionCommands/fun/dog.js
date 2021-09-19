const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'dog',
	description: 'Random dog image',
	ESdesc: 'Imagen aleatoria de un perro',
	usage: 'dog',
	example: 'dog',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES))
			return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
		interaction.reply({
			files: [
				{
					attachment: body.message
				}
			]
		});
	}
};
