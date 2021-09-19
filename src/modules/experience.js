const { ModelRank, ModelLvlRol, ModelUsers } = require('../utils/models');
async function giveXp(message, xp) {
	let globalLean = await ModelUsers.findOne({ id: message.author.id }).lean();
	if (!globalLean) {
		let newModel = new ModelUsers({
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
		await newModel.save();
		return;
	} else {
		let time = globalLean.cooldown;
		if (Math.floor(Date.now() - time < 120000)) return;
		else {
			let global = await ModelUsers.findOne({ id: message.author.id });
			let randomxp = Math.floor(Math.random() * 11) + 10;
			global.globalxp = global.globalxp + randomxp;
			global.cooldown = Date.now();

			await global.save();

			let localLean = await ModelRank.findOne({
				id: message.author.id,
				server: message.guild.id
			}).lean();
			if (!localLean) {
				let newRankModel = new ModelRank({
					id: message.author.id,
					server: message.guild.id,
					nivel: 1,
					xp: randomxp
				});
				await newRankModel.save();
			} else if (localLean.xp + randomxp >= Math.floor(localLean.nivel / 0.0081654953837673)) {
				const role = await ModelLvlRol.findOne({
					server: message.guild.id,
					level: localLean.nivel + 1
				}).lean();
				if (role) {
					let rol = message.guild.roles.cache.get(role.role);
					message.member.roles.add(rol);
					let lvlObj = {
						'{user}': `<@${message.author.id}>`,
						'{role}': rol.name
					};
					message.channel.send(xp.lvlup.replaceAll(lvlObj));
				}
				let local = await ModelRank.findOne({
					id: message.author.id,
					server: message.guild.id
				});
				local.nivel = local.nivel + 1;
				local.xp = 0;
				await local.save();
			} else {
				const arr = [...Array(localLean.nivel).keys()];
				arr.forEach(async (number) => {
					const role = await ModelLvlRol.findOne({
						server: message.guild.id,
						level: number
					});
					if (role) {
						let rol = message.guild.roles.cache.get(role.role);
						message.member.roles.add(rol);
					}
				});
				let local = await ModelRank.findOne({
					id: message.author.id,
					server: message.guild.id
				});
				local.xp = local.xp + randomxp;
				await local.save();
			}
		}
	}
}
module.exports = { giveXp };
