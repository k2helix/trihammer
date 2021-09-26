/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
const { ModelServer } = require('../utils/models');
module.exports = async (client, oldMember, newMember) => {
	const serverConfig = await ModelServer.findOne({ server: oldMember.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = oldMember.guild.channels.cache.get(serverConfig.memberlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	var Changes = {
		unknown: 0,
		addedRole: 1,
		removedRole: 2,
		username: 3,
		nickname: 4
	};
	var change = Changes.unknown;

	var removedRole = '';
	var role2 = '';
	oldMember.roles.cache.sweep(function (value) {
		if (newMember.roles.cache.get(value.id) == null) {
			change = Changes.removedRole;
			// eslint-disable-next-line no-unused-vars
			removedRole = value.name;
			role2 = value;
		}
	});
	var addedRole = '';
	var role = '';
	newMember.roles.cache.sweep(function (value) {
		if (oldMember.roles.cache.get(value.id) == null) {
			change = Changes.addedRole;
			// eslint-disable-next-line no-unused-vars
			addedRole = value.name;
			role = value;
		}
	});

	if (newMember.nickname != oldMember.nickname) change = Changes.nickname;

	let fecha1 = Date.now() - 10000;
	switch (change) {
		case Changes.addedRole:
			logs_channel.send(events.member.update.role_added.replaceAll({ '{member}': `${newMember.user.tag} (${newMember.id})`, '{role}': role.name }));
			break;
		case Changes.removedRole:
			logs_channel.send(events.member.update.role_removed.replaceAll({ '{member}': `${newMember.user.tag} (${newMember.id})`, '{role}': role2.name }));
			break;
		case Changes.nickname:
			logs_channel.send(
				events.member.update.nickname.replaceAll({
					'{member}': `${newMember.user.tag} (${newMember.user.id})`,
					'{new}': newMember.displayName,
					'{old}': oldMember.displayName
				})
			);
			break;
	}
};
