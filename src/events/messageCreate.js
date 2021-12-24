const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

const { ModelServer } = require('../utils/models');

String.prototype.replaceAll = function (obj) {
	var target = this;
	for (var key in obj) target = target.replace(key, obj[key]);

	return target;
};
module.exports = async (client, message) => {
	if (!client.application?.owner) await client.application?.fetch();
	if (message.author.bot) return;

	var serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
	if (!serverConfig) {
		let newGuildModel = new ModelServer({
			server: message.guild.id,
			modrole: 'none',
			adminrole: 'none',
			messagelogs: 'none',
			voicelogs: 'none',
			actionslogs: 'none',
			memberlogs: 'none',
			serverlogs: 'none',
			infrlogs: 'none',
			prefix: require('../../config.json').default_prefix,
			lang: 'en',
			autorole: 'none',
			antispam: false
		});
		await newGuildModel.save();
		serverConfig = newGuildModel;
	}

	const langcode = serverConfig.lang;
	const prefix = '-';
	const { other, config, util, xp } = require(`../utils/lang/${langcode}.js`);

	// require('../utils/methods/spam').check(serverConfig, message);

	require('../modules/experience').giveXp(message, xp);

	require('../utils/functions').prinsjoto(message);

	if (message.content.match(`^<@(!)?${client.user.id}>`)) return message.channel.send(other.mention.split('{prefix}').join(prefix));

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.myPerms) {
		let permsString = command.myPerms.slice(1);
		let permsBitfield = permsString.map((p) => Discord.Permissions.FLAGS[p]);

		switch (command.myPerms[0]) {
			case true:
				if (!message.channel.permissionsFor(message.guild.me).has(permsBitfield))
					return message.channel.send(other.need_perm.channel.replace('{perms}', permsString.map((perm) => `\`${perm}\``).join(', ')));

				break;
			default:
				if (!message.guild.me.permissions.has(permsBitfield))
					return message.channel.send(other.need_perm.guild.replace('{perms}', permsString.map((perm) => `\`${perm}\``).join(', ')));
		}
	}

	if (command.cooldown) {
		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = command.cooldown * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send(`<@${message.author.id}>, ` + util.cooldown(timeLeft.toFixed(1), command.name));
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	try {
		command.execute(client, message, args);
		if (serverConfig.actionslogs === 'none') return;
		setTimeout(() => {
			let logs_channel = message.guild.channels.cache.get(serverConfig.actionslogs);
			if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
			let cmdObj = {
				'{user}': message.author.tag,
				'{command}': command.name,
				'{channel}': `<#${message.channel.id}>`
			};
			return logs_channel.send(config.command_used.replaceAll(cmdObj));
		}, 1000);
	} catch (error) {
		console.error(error);
	}
};
