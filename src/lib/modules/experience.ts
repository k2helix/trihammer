import { Message } from 'discord.js';
import ExtendedClient from '../structures/Client';
import LanguageFile from '../structures/interfaces/LanguageFile';
import { ModelLvlRol, ModelRank, ModelUsers } from '../utils/models';
async function manageActivity(client: ExtendedClient, message: Message, xp: LanguageFile['xp']) {
	if (!message.guild || !message.member) return;
	const globalLean = await ModelUsers.findOne({ id: message.author.id }).lean();
	if (!globalLean) {
		const newModel = new ModelUsers({
			id: message.author.id,
			globalxp: 0,
			pimage: 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png',
			rimage: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png',
			pdesc: '',
			ptext: 'Bla bla bla...',
			rep: 0,
			cooldown: 0,
			repcooldown: 0
		});
		return await newModel.save();
	} else {
		const time: number = globalLean.cooldown;
		if (Math.floor(Date.now() - time) < 120000) return;
		else {
			const global = await ModelUsers.findOne({ id: message.author.id });
			const randomxp = Math.floor(Math.random() * 11) + 10;
			global.globalxp = global.globalxp + randomxp;
			global.cooldown = Date.now();

			await global.save();

			const localLean = await ModelRank.findOne({
				id: message.author.id,
				server: message.guild.id
			}).lean();
			if (!localLean) {
				const newRankModel = new ModelRank({
					id: message.author.id,
					server: message.guild.id,
					nivel: 1,
					xp: randomxp
				});
				await newRankModel.save();
			} else if (localLean.xp + randomxp >= Math.floor(localLean.nivel / 0.0081654953837673)) {
				const roleInDb: { server: string; level: number; role: string } = await ModelLvlRol.findOne({
					server: message.guild.id,
					level: localLean.nivel + 1
				}).lean();
				if (roleInDb) {
					const rol = message.guild.roles.cache.get(roleInDb.role);
					if (rol) {
						message.member.roles.add(rol);
						const lvlObj = {
							'{user}': `<@${message.author.id}>`,
							'{role}': rol.name
						};
						message.channel.send(client.replaceEach(xp.lvlup, lvlObj));
					}
				}
				const local = await ModelRank.findOne({
					id: message.author.id,
					server: message.guild.id
				});
				local.nivel = local.nivel + 1;
				local.xp = 0;
				await local.save();
			} else {
				const previousLevels = [...Array(localLean.nivel).keys()];
				previousLevels.forEach(async (number) => {
					const roleInDb: { server: string; level: number; role: string } = await ModelLvlRol.findOne({
						server: message.guild!.id,
						level: number
					});
					if (roleInDb) {
						const rol = message.guild!.roles.cache.get(roleInDb.role);
						if (rol) message.member!.roles.add(rol);
					}
				});
				const local = await ModelRank.findOne({
					id: message.author.id,
					server: message.guild.id
				});
				local.xp = local.xp + randomxp;
				await local.save();
			}
		}
	}
}
export default manageActivity;
