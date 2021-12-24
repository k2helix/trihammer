const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
	name: 'timeout',
	description: 'Timeout a member',
	ESdesc: 'Aisla a un usuario temporalmente',
	usage: 'timeout <member> <duration> [reason]',
	example: 'timeout @uwu 1h me cae mal',
	myPerms: [false, 'MODERATE_MEMBERS'],
	type: 0,
	execute(client, interaction, guildConf) {
		let { mod, functions, config } = require(`../../utils/lang/${guildConf.lang}.js`);
		let permiso =
			guildConf.modrole !== 'none' ? interaction.member.roles.cache.has(guildConf.modrole) : interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS);
		let adminperms =
			guildConf.adminrole !== 'none' ? interaction.member.roles.cache.has(guildConf.adminrole) : interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS);
		if (!permiso && !adminperms) return interaction.reply({ content: config.mod_perm, ephemeral: true });

		let user = interaction.options.getUser('user'),
			reason = interaction.options.getString('reason'),
			duration = interaction.options.getString('duration');

		let member = interaction.guild.members.cache.get(user.id);

		if (duration.startsWith('0')) {
			let unmuteEmbed = new MessageEmbed().setColor('RANDOM').setDescription(mod.timeout.clear.replace('{member}', user.tag));
			member.timeout(null, (reason || 'No reason') + ` | by ${interaction.user.tag}`);
			return interaction.reply({ embeds: [unmuteEmbed] });
		}

		let time = functions.Convert(duration);
		if (!time) return interaction.reply({ content: mod.time_404, ephemeral: true });
		if (time.tiempo >= 2419200000) return interaction.reply({ content: mod.timeout.time, ephemeral: true });

		let embed = new MessageEmbed().setColor('RANDOM').setDescription(
			mod.timeout.timeout.replaceAll({
				'{member}': member.user.tag,
				'{duration}': time.nombre,
				'{reason}': reason || 'No'
			})
		);
		member.timeout(time.tiempo, (reason || 'No reason') + ` | by ${interaction.user.tag}`);
		interaction.reply({ embeds: [embed] });
	}
};
