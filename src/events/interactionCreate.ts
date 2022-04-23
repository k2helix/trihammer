import { Collection, GuildMember, Interaction, Permissions, TextChannel } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import ContextMenuName from '../lib/structures/interfaces/ContextMenuName';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';

const cooldowns = new Collection();

import { ModelServer, Server } from '../lib/utils/models';
module.exports = async (client: ExtendedClient, interaction: Interaction) => {
	if (!interaction.inGuild() || !interaction.guild) return interaction.user.send({ content: 'You can only use commands in servers' });
	let guildConf: Server = await ModelServer.findOne({ server: interaction.guildId }).lean();
	if (!guildConf) {
		let newGuild = {
			server: interaction.guild.id,
			modrole: 'none',
			adminrole: 'none',
			interactionlogs: 'none',
			voicelogs: 'none',
			actionslogs: 'none',
			memberlogs: 'none',
			messagelogs: 'none',
			serverlogs: 'none',
			infrlogs: 'none',
			prefix: (await import('../../config.json')).default_prefix,
			lang: 'en',
			autorole: 'none',
			antispam: false
		};
		const newGuildModel = new ModelServer(newGuild);
		await newGuildModel.save();
		guildConf = newGuild;
	}
	const { config, util, other } = (await import(`../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

	if (interaction.isContextMenu()) {
		let cmdName = interaction.commandName.toLowerCase().split(' ').join('-') as ContextMenuName;
		let names = {
			'add-to-queue': 'music-play',
			'get-sauce': 'sauce',
			translate: 'translate',
			'invite-to-yt-together': 'youtube-together',
			avatar: 'avatar',
			information: 'info',
			'play-connect-4': 'connect4',
			'play-tic-tac-toe': 'tictactoe'
		};
		client.interactionCommands.get(names[cmdName])!.execute(client, interaction, guildConf);
	}
	if (interaction.isCommand()) {
		if (!interaction.inGuild() || interaction.user.bot) return;
		const command = client.interactionCommands.get(interaction.commandName);
		if (!command) return;

		// quitar los ? cuando acabe
		if (command.client_perms?.length > 0) {
			const permsBitfield = Permissions.resolve(command.client_perms);
			if (!interaction.guild.me!.permissions.has(permsBitfield))
				return interaction.reply({ embeds: [client.redEmbed(other.need_perm.guild.replace('{perms}', command.client_perms.map((perm) => `\`${perm}\``).join(', ')))] });
		}

		if (command.required_roles?.length > 0)
			if (interaction.guild.roles.cache.hasAny(guildConf.modrole, guildConf.adminrole)) {
				let perms = command.required_roles.includes('MODERATOR')
					? (interaction.member as GuildMember).roles.cache.hasAny(guildConf.modrole, guildConf.adminrole)
					: (interaction.member as GuildMember).roles.cache.has(guildConf.adminrole);
				if (!perms)
					if (command.required_perms?.length > 0) {
						const permsBitfield = Permissions.resolve(command.required_perms);
						if (!(interaction.member as GuildMember)?.permissions.has(permsBitfield))
							return interaction.reply({ embeds: [client.redEmbed(config.required_perms + `${command.required_perms.map((p) => `\`${p}\``).join(', ')}`)], ephemeral: true });
					} else return interaction.reply({ embeds: [client.redEmbed(command.required_roles.includes('MODERATOR') ? config.mod_perm : config.admin_perm)], ephemeral: true });
			}

		if (command.required_perms?.length > 0 && (command.required_roles?.length === 0 || !interaction.guild.roles.cache.hasAny(guildConf.modrole, guildConf.adminrole))) {
			const permsBitfield = Permissions.resolve(command.required_perms);
			if (!(interaction.member as GuildMember)?.permissions.has(permsBitfield))
				return interaction.reply({ embeds: [client.redEmbed(config.required_perms + `${command.required_perms.map((p) => `\`${p}\``).join(', ')}`)], ephemeral: true });
		}

		if (command.cooldown) {
			if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

			const now = Date.now();
			const timestamps = cooldowns.get(command.name) as Collection<string, number>;
			const cooldownAmount = command.cooldown * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({ embeds: [client.redEmbed(`<@${interaction.user.id}>, ` + util.cooldown(timeLeft.toFixed(1), command.name))], ephemeral: true });
				}
			}
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}
		try {
			command.execute(client, interaction, guildConf);
			if (guildConf.actionslogs === 'none') return;
			let logs_channel = interaction.guild!.channels.cache.get(guildConf.actionslogs);
			if (!logs_channel || !logs_channel.isText()) return;
			let cmdObj = {
				'{user}': interaction.user.tag,
				'{command}': command.name,
				'{channel}': `<#${interaction.channelId}>`
			};
			return logs_channel.send(client.replaceEach(config.command_used, cmdObj));
		} catch (error) {
			client.catchError(error, interaction.channel as TextChannel);
		}
	}
};
