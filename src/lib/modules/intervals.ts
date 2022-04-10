import Client from '../structures/Client';
import { ModelMutes, ModelRemind, ModelTempban, Mutes, Remind, Tempban } from '../utils/models';
export default function checkTimeouts(client: Client) {
	setInterval(async () => {
		const reminders: Remind[] = await ModelRemind.find({ active: true });
		for (const reminder of reminders) {
			const user = client.users.cache.get(reminder.id);
			if (!user) continue;
			if (reminder.expire > Date.now()) continue;
			if (reminder.active === false) continue;

			if (reminder.expire < Date.now()) {
				user.send(':alarm_clock: Recordatorio: ' + reminder.reason);
				const modelo = await ModelRemind.findOne({
					expire: reminder.expire,
					id: reminder.id
				});
				modelo.active = false;
				modelo.save();
			}
		}
		const mutes: Mutes[] = await ModelMutes.find({ active: true });
		for (const mute of mutes) {
			const modelo = await ModelMutes.findOne({
				expire: mute.expire,
				id: mute.id,
				server: mute.server
			});

			const user = client.users.cache.get(mute.id);
			if (!user) continue;

			const server = client.guilds.cache.get(mute.server);
			if (!server) continue;

			const member = server.members.cache.get(mute.id);
			if (!member) continue;

			if (mute.expire > Date.now()) continue;
			if (mute.active === false) continue;

			const role = server.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
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

		const tempbans: Tempban[] = await ModelTempban.find({ active: true });
		for (const tempban of tempbans) {
			const modelo = await ModelTempban.findOne({
				expire: tempban.expire,
				id: tempban.id,
				server: tempban.server
			});
			const user = client.users.cache.get(tempban.id);
			if (!user) continue;

			const server = client.guilds.cache.get(tempban.server);
			if (!server) continue;

			if (tempban.expire > Date.now()) continue;
			if (tempban.active === false) continue;

			const banusers = await server.bans.fetch();
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
