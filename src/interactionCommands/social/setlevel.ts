const { ModelRank } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'setlevel',
	description: "Set someone's level to x",
	ESdesc: 'Establece el nivel de alguien a x',
	usage: 'setlevel <user> <level>',
	example: 'setlevel @user 12',
	aliases: ['addlevel'],
	type: 5,
	async execute(client, interaction, guildConf) {
		const { xp } = require(`../../lib/utils/lang/${guildConf.lang}`);
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: xp.no_perms, ephemeral: true });
		let user = interaction.options.getUser('user');
		if (!user) return;
		if (user.bot) return interaction.reply({ content: 'no bots', ephemeral: true });

		let nivel = interaction.options.getString('level');
		if (!nivel) return interaction.reply({ content: xp.need_lvl, ephemeral: true });
		if (isNaN(nivel)) return interaction.reply({ content: xp.need_lvl, ephemeral: true });
		if (nivel.startsWith('-')) return interaction.reply({ content: xp.need_lvl, ephemeral: true });
		let local = await ModelRank.findOne({ id: user.id, server: interaction.guildId });
		if (!local) {
			let newRankModel = new ModelRank({
				id: user.id,
				server: interaction.guildId,
				nivel: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		local.nivel = nivel;
		await local.save();
		interaction.reply(':white_check_mark:');
	}
};
