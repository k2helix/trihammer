const request = require('node-superfetch');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'fox',
	description: 'Random fox image',
	ESdesc: 'Imagen aleatoria de un zorro',
	usage: 'fox',
	example: 'fox',
	type: -1,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, interaction, guildConf) {
		let { other } = require(`../../utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ATTACH_FILES)) return interaction.reply({ content: other.need_perm.attach_files, ephemeral: true });
		const { body } = await request.get('https://randomfox.ca/floof/');
		interaction.reply({
			files: [
				{
					attachment: body.image
				}
			]
		});
	}
};
