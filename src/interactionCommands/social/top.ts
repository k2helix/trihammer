import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';
import { ModelRank, ModelUsers, Rank, Users } from '../../lib/utils/models';
export default new Command({
	name: 'top',
	description: 'Get the XP ranking of the server',
	cooldown: 3,
	category: 'social',
	async execute(client, interaction) {
		interaction.deferReply();
		if ((interaction as CommandInteraction).options.getBoolean('global')) {
			let top: Users[] = await ModelUsers.find({ globalxp: { $gte: 300000 } }).lean();
			top.sort((a, b) => {
				return b.globalxp - a.globalxp;
			});
			let usuarios = [];
			for (let x in top.slice(0, 10)) {
				let user = await client.users.fetch(top[x].id);
				usuarios.push(`${parseFloat(x) + 1} - ${user.tag}:\nGlobal XP ${top[x].globalxp}`);
			}

			interaction.editReply(`** - 🏆 Global Rank -  **\n\`\`\`cs\n${usuarios.join('\n')}\`\`\``);
		} else {
			let top: Rank[] = await ModelRank.find({ server: interaction.guildId }).lean();
			top.sort((a, b) => {
				return b.nivel - a.nivel || b.xp - a.xp;
			});
			let posicion = (element: Rank) => element.id === interaction.user.id && element.server === interaction.guildId;
			let usuarios = [];
			// eslint-disable-next-line no-redeclare
			for (let x in top.slice(0, 10)) {
				let user = interaction.guild!.members.cache.has(top[x].id) ? interaction.guild!.members.cache.get(top[x].id)!.user.tag : 'Uncached user (' + top[x].id + ')';
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
});
