const { ModelUsers, ModelRank } = require('../../utils/models');
module.exports = {
	name: 'top',
	description: 'Get the XP ranking of the server',
	ESdesc: 'Obtén el top de XP del servidor',
	usage: 'top [global]',
	example: 'top\ntop global',
	cooldown: 3,
	aliases: ['leaderboard', 'ranking'],
	type: 5,
	async execute(client, interaction) {
		interaction.deferReply();
		if (interaction.options.getBoolean('global')) {
			let top = await ModelUsers.find({ globalxp: { $gte: 250000 } }).lean();
			top.sort((a, b) => {
				return b.globalxp - a.globalxp;
			});
			let usuarios = [];
			for (var x in top.slice(0, 10)) {
				let user = await client.users.fetch(top[x].id);
				usuarios.push(`${parseFloat(x) + 1} - ${user.tag}:\nGlobal XP ${top[x].globalxp}`);
			}

			interaction.editReply(`** - 🏆 Global Rank -  **\n\`\`\`cs\n${usuarios.join('\n')}\`\`\``);
		} else {
			let top = await ModelRank.find({ server: interaction.guildId }).lean();
			top.sort((a, b) => {
				return b.nivel - a.nivel || b.xp - a.xp;
			});
			let posicion = (element) => element.id === interaction.user.id && element.server === interaction.guildId;
			let usuarios = [];
			// eslint-disable-next-line no-redeclare
			for (var x in top.slice(0, 10)) {
				let user = interaction.guild.members.cache.has(top[x].id) ? interaction.guild.members.cache.get(top[x].id).user.tag : 'Uncached user (' + top[x].id + ')';
				usuarios.push(`${parseFloat(x) + 1} - ${user}:\nLevel ${top[x].nivel} ~ XP ${top[x].xp}`);
			}
			let lugar = top
				.sort((a, b) => {
					return b.nivel - a.nivel || b.xp - a.xp;
				})
				.findIndex(posicion);
			interaction.editReply(
				`** - 🏆 Server Rank -  **\n\`\`\`cs\n${usuarios.join('\n')}\n-------------------------------------\n Your stats:\n Rank ${lugar + 1}\n Level ${top[lugar].nivel} XP ${
					top[lugar].xp
				}  \`\`\``
			);
		}
	}
};
