const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

const { ModelServer } = require('../utils/models');
module.exports = async (client, interaction) => {
	if (!interaction.inGuild()) return interaction.reply({ content: 'You can only use commands in servers', ephemeral: true });
	var guildConf = await ModelServer.findOne({ server: interaction.guildId }).lean();
	if (!guildConf) {
		let newGuildModel = new ModelServer({
			server: interaction.guildId,
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
		guildConf = newGuildModel;
	}
	const { config, util, other } = require(`../utils/lang/${guildConf.lang}.js`);
	// eslint-disable-next-line curly
	// if (interaction.isSelectMenu()) {
	// 	client.interactionCommands.get(interaction.customId).execute(client, interaction, guildConf);
	// }
	if (interaction.isContextMenu()) {
		var cmdName = interaction.commandName.toLowerCase().split(' ').join('-');
		var names = {
			'add-to-queue': 'music-play',
			'get-sauce': 'sauce',
			translate: 'translate',
			'invite-to-yt-together': 'youtube-together',
			avatar: 'avatar',
			information: 'info',
			'play-connect-4': 'connect4',
			'play-tic-tac-toe': 'tictactoe'
		};
		client.interactionCommands.get(names[cmdName]).execute(client, interaction, guildConf);
	}
	if (interaction.isCommand()) {
		if (interaction.user.bot) return;
		const command = client.interactionCommands.get(interaction.commandName);

		if (!command) return;
		if (command.type === 3 || command.type === 2) return interaction.reply({ content: 'Moderation and configuration commands are not available yet', ephemeral: true });

		if (command.myPerms) {
			let permsString = command.myPerms.slice(1);
			let permsBitfield = permsString.map((p) => Discord.Permissions.FLAGS[p]);

			switch (command.myPerms[0]) {
				case true:
					if (!interaction.channel.permissionsFor(interaction.guild.me).has(permsBitfield))
						return interaction.reply({
							content: other.need_perm.channel.replace('{perms}', permsString.map((perm) => `\`${perm}\``).join(', ')),
							ephemeral: true
						});

					break;
				default:
					if (!interaction.guild.me.permissions.has(permsBitfield))
						return interaction.reply({
							content: other.need_perm.guild.replace('{perms}', permsString.map((perm) => `\`${perm}\``).join(', ')),
							ephemeral: true
						});
			}
		}

		if (command.cooldown) {
			if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = command.cooldown * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({ content: `<@${interaction.user.id}>, ` + util.cooldown(timeLeft.toFixed(1), command.name), ephemeral: true });
				}
			}
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}
		try {
			command.execute(client, interaction, guildConf);
			if (guildConf.actionslogs === 'none') return;
			setTimeout(() => {
				let logs_channel = interaction.guild.channels.cache.get(guildConf.actionslogs);
				if (!logs_channel || !logs_channel.isText()) return;
				let cmdObj = {
					'{user}': interaction.user.tag,
					'{command}': command.name,
					'{channel}': `<#${interaction.channelId}>`
				};
				return logs_channel.send(config.command_used.replaceAll(cmdObj));
			}, 1000);
		} catch (error) {
			interaction.reply({ content: other.error + error.message, ephemeral: true });
			console.error(error);
		}
	}
};
