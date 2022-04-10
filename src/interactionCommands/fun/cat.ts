const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'cat',
	description: 'Random cat image',
	ESdesc: 'Imagen aleatoria de un gato <3',
	usage: 'cat',
	example: 'cat',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES))
			return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://api.thecatapi.com/v1/images/search'); //https://aws.random.cat/meow
		interaction.reply({
			files: [
				{
					attachment: body[0].url
				}
			]
		});
	}
};
