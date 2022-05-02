// si va mal copiarlo de master de nuevo; es para testear y evitar el findOne
import Client from '../structures/Client';
import { ModelMutes, ModelRemind, ModelTempban } from '../utils/models';
export default function checkTimeouts(client: Client) {
	setInterval(async () => {
		const reminders = await ModelRemind.find({ active: true });
		for (const reminder of reminders) {
			const user = await client.users.fetch(reminder.id).catch(() => undefined);
			if (!user) continue;
			if (reminder.expire > Date.now()) continue;
			if (reminder.active === false) continue;

			if (reminder.expire < Date.now()) {
				user.send(':alarm_clock: Recordatorio: ' + reminder.reason);
				reminder.active = false;
				reminder.save();
			}
		}
		const mutes = await ModelMutes.find({ active: true });
		for (const mute of mutes) {
			const user = await client.users.fetch(mute.id).catch(() => undefined);
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
				mute.active = false;
				mute.save();
			}

			if (mute.expire < Date.now()) {
				member.roles.remove(role);
				mute.active = false;
				mute.save();
			}
		}

		const tempbans = await ModelTempban.find({ active: true });
		for (const tempban of tempbans) {
			const user = await client.users.fetch(tempban.id).catch(() => undefined);
			if (!user) continue;

			const server = client.guilds.cache.get(tempban.server);
			if (!server) continue;

			if (tempban.expire > Date.now()) continue;
			if (tempban.active === false) continue;

			const banusers = await server.bans.fetch();
			if (!banusers.has(user.id)) {
				tempban.active = false;
				tempban.save();
				continue;
			}

			if (tempban.expire < Date.now()) {
				server.members.unban(user.id);
				tempban.active = false;
				tempban.save();
			}
		}
	}, 30000);
}
