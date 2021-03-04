/* eslint-disable no-case-declarations */
const { ModelServer } = require('../utils/models');
module.exports = async (client, oldMember, newMember) => {
	const serverConfig = await ModelServer.findOne({ server: oldMember.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = require(`../utils/lang/${serverConfig.lang}.js`);

	let logs_channel = oldMember.guild.channels.cache.get(serverConfig.memberlogs);
	if (!logs_channel || logs_channel.type !== 'text') return;
	if (!oldMember.guild.me.hasPermission('VIEW_AUDIT_LOG')) return;

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
			const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then((audit) => audit.entries.first());
			let user = fecha1 > entry.createdTimestamp ? 'Bot' : entry.executor.tag;
			logs_channel.send(
				events.member.update.role_added.replaceAll({ '{user}': user, '{member}': `${newMember.user.tag} (${newMember.id})`, '{role}': role.name })
			);
			break;
		case Changes.removedRole:
			const entry2 = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then((audit) => audit.entries.first());
			let user2 = fecha1 > entry2.createdTimestamp ? 'Bot' : entry2.executor.tag;
			logs_channel.send(
				events.member.update.role_removed.replaceAll({ '{user}': user2, '{member}': `${newMember.user.tag} (${newMember.id})`, '{role}': role2.name })
			);
			break;
		case Changes.nickname:
			const entry3 = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' }).then((audit) => audit.entries.first());
			let user3 = fecha1 > entry3.createdTimestamp ? 'Bot' : entry3.executor.tag;
			logs_channel.send(
				events.member.update.nickname.replaceAll({
					'{user}': user3,
					'{member}': `${newMember.user.tag} (${newMember.user.id})`,
					'{new}': newMember.displayName,
					'{old}': oldMember.displayName
				})
			);
			break;
	}
};
