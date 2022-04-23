/* eslint-disable no-case-declarations */
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
import { digitalTime } from '../../lib/utils/functions';
import { Infrs, ModelInfrs, ModelMutes, ModelTempban } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'infsearch',
	description: 'Get the infractions of the given user',
	category: 'moderation',
	required_args: [{ index: 0, name: 'user', type: 'id' }],
	required_perms: ['MANAGE_MESSAGES'],
	required_roles: ['MODERATOR'],
	aliases: ['inf', 'infractions', 'infrs'],
	async execute(client, message, args, guildConf) {
		const { mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let user = message.mentions.users.first() || client.users.cache.get(args[0]);
		if (!user)
			try {
				user = await client.users.fetch(args[0]);
			} catch (err) {
				return message.channel.send({ embeds: [client.redEmbed(mod.need_id)] });
			}

		let member = message.guild!.members.cache.get(user.id!);
		const datos: Infrs[] = await ModelInfrs.find({ server: message.guildId, id: user.id });

		if (!datos[0]) return message.channel.send(mod.infrs_404);
		let infr = [];
		datos.sort((a, b) => {
			return parseInt(b.time) - parseInt(a.time);
		});

		for (let x in datos) {
			let activo;
			switch (datos[x].tipo) {
				case 'warn':
					activo = mod.no;
					break;
				case 'kick':
					activo = message.guild!.members.cache.has(datos[x].id) ? mod.no : mod.yes;
					break;
				case 'tempban':
					let tempban = await ModelTempban.findOne({ key: datos[x].key });
					activo = tempban.active ? mod.yes : mod.no;
					break;
				case 'mute':
					let mutes = await ModelMutes.findOne({ key: datos[x].key });
					if (!mutes) {
						let rol = message.guild!.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
						if (!rol) activo = mod.no;
						else if (member) activo = member.roles.cache.has(rol.id) ? mod.yes : mod.no;
						else activo = mod.no;
					} else activo = mutes.active ? mod.yes : mod.no;
					break;
				case 'ban':
					let banusers = await message.guild!.bans.fetch();
					if (!banusers.has(datos[x].id)) activo = mod.no;
					else activo = mod.yes;
					break;
			}

			let modn = datos[x].mod.includes('#') || datos[x].mod.toLowerCase() === 'antispam system' ? null : await client.users.fetch(datos[x].mod);
			let modname = modn ? modn.tag : datos[x].mod;

			infr.push(`${datos[x].tipo} | ${modname} | ${datos[x].reason} | ${datos[x].duration || 'N/A'} | ${activo} | ${digitalTime(Number(datos[x].time))} | ${datos[x].key}`);
		}

		message.channel.send(`${mod.user_infrs.replace('{user}', user.tag)}\n${infr.join('\n')}\`\`\``);
	}
});
