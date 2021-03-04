const { ModelMutes, ModelRemind, ModelTempban } = require('../models');
function check(client) {
	setInterval(async () => {
		const reminders = await ModelRemind.find({ active: true });
		for (let reminder of reminders) {
			let user = client.users.cache.get(reminder.id);
			if (!user) continue;
			if (reminder.expire > Date.now()) continue;
			if (reminder.active === false) continue;

			if (reminder.expire < Date.now()) {
				user.send(':alarm_clock: Recordatorio: ' + reminder.reason);
				let modelo = await ModelRemind.findOne({
					expire: reminder.expire,
					id: reminder.id
				});
				modelo.active = false;
				modelo.save();
			}
		}
		const mutes = await ModelMutes.find({ active: true });
		for (let mute of mutes) {
			let modelo = await ModelMutes.findOne({
				expire: mute.expire,
				id: mute.id,
				server: mute.server
			});

			let user = client.users.cache.get(mute.id);
			if (!user) continue;

			let server = client.guilds.cache.get(mute.server);
			if (!server) continue;

			let member = server.members.cache.get(mute.id);
			if (!member) continue;

			if (mute.expire > Date.now()) continue;
			if (mute.active === false) continue;

			let role = server.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
			if (!role) continue;
			if (!member.roles.cache.has(role.id)) {
				modelo.active = false;
				modelo.save();
			}

			if (mute.expire < Date.now()) {
				member.roles.remove(role);
				modelo.active = false;
				modelo.save();
			}
		}

		const tempbans = await ModelTempban.find({ active: true });
		for (let tempban of tempbans) {
			let modelo = await ModelTempban.findOne({
				expire: tempban.expire,
				id: tempban.id,
				server: tempban.server
			});
			let user = client.users.cache.get(tempban.id);
			if (!user) continue;

			let server = client.guilds.cache.get(tempban.server);
			if (!server) continue;

			if (tempban.expire > Date.now()) continue;
			if (tempban.active === false) continue;

			let banusers = await server.fetchBans();
			if (!banusers.has(user.id)) {
				modelo.active = false;
				modelo.save();
				continue;
			}

			if (tempban.expire < Date.now()) {
				server.members.unban(user.id);
				modelo.active = false;
				modelo.save();
			}
		}
	}, 30000);
}
module.exports = { check };
