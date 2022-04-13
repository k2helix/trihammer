import { ButtonInteraction, Collection, GuildChannel, Message, MessageActionRow, MessageButton, Permissions, TextChannel } from 'discord.js';
import ManageActivity from '../lib/modules/experience';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { compareTwoStrings } from '../lib/utils/functions';

const cooldowns = new Collection();

import { ModelServer, Server } from '../lib/utils/models';

export default async (client: ExtendedClient, message: Message) => {
	if (!client.application?.owner) await client.application?.fetch();
	if (message.author.bot || !message.guild || !message.member) return;

	let serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
	if (!serverConfig) {
		let newGuild = {
			server: message.guild.id,
			modrole: 'none',
			adminrole: 'none',
			messagelogs: 'none',
			voicelogs: 'none',
			actionslogs: 'none',
			memberlogs: 'none',
			serverlogs: 'none',
			infrlogs: 'none',
			prefix: (await import('../../config.json')).default_prefix,
			lang: 'en',
			autorole: 'none',
			antispam: false
		};
		const newGuildModel = new ModelServer(newGuild);
		await newGuildModel.save();
		serverConfig = newGuild;
	}
	const prefix = '-';
	const { config, util, other, xp } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	// require('../utils/methods/spam').check(serverConfig, message);

	ManageActivity(client, message, xp);

	// require('../lib/utils/functions').prinsjoto(message);

	if (message.content.match(`^<@(!)?${client.user!.id}>`)) return message.channel.send({ embeds: [client.orangeEmbed(other.mention.split('{prefix}').join(prefix))] });

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift()!.toLowerCase();

	let command = client.commands.get(commandName) ?? client.commands.find((cmd) => Boolean(cmd.aliases?.includes(commandName)));
	if (!command) {
		const scores = client.commands
			.map(({ name, aliases }) => {
				if (!name) return { name: 'unknown', score: 0 };

				const base = { name, score: compareTwoStrings(name, commandName) };
				if (!aliases) return base;

				const bestAlias = aliases.map((alias) => ({ name: alias, score: compareTwoStrings(alias, commandName) })).sort((a, b) => b.score - a.score)[0];
				if (!bestAlias) return base;

				return bestAlias?.score > base.score ? bestAlias : base;
			})
			.sort((a, b) => b.score - a.score);
		let possibleMatches = scores.filter((sc) => sc.score > 0.75);
		if (possibleMatches.length > 0) {
			let buttons = [];
			possibleMatches.slice(0, 4).forEach((match) => {
				buttons.push(new MessageButton().setCustomId(match.name).setLabel(match.name).setStyle('SECONDARY'));
			});
			buttons.push(new MessageButton().setCustomId('crossx').setEmoji('882639143874723932').setStyle('DANGER'));
			const row = new MessageActionRow().addComponents(buttons);
			let sentMessage = await message.channel.send({ embeds: [client.orangeEmbed(util.similar_commands)], components: [row] });

			const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
			try {
				let selected = await sentMessage.awaitMessageComponent({ filter, time: 15000, componentType: 'BUTTON' });
				if (selected.customId === 'crossx') {
					sentMessage.delete();
					return selected.reply({ embeds: [client.blackEmbed(util.none_selected)], ephemeral: true });
				}
				command = client.commands.get(selected.customId) ?? client.commands.find((cmd) => Boolean(cmd.aliases?.includes(selected.customId)));
				selected.reply({ embeds: [client.blackEmbed(util.command_selected)], ephemeral: true });
				sentMessage.delete();
			} catch (error) {
				return sentMessage.delete();
			}
		} else return;
	}

	//quitar los ? cuando acabe
	if (!command) return;
	if (command.client_perms?.length > 0) {
		const permsBitfield = Permissions.resolve(command.client_perms);
		if (!message.guild.me!.permissions.has(permsBitfield))
			return message.channel.send({ embeds: [client.redEmbed(other.need_perm.guild.replace('{perms}', command.client_perms.map((perm) => `\`${perm}\``).join(', ')))] });
	}

	if (command.required_roles?.length > 0)
		if (message.guild.roles.cache.has(serverConfig.modrole) && message.guild.roles.cache.has(serverConfig.adminrole)) {
			let perms = command.required_roles.includes('MODERATOR')
				? message.member.roles.cache.hasAny(serverConfig.modrole, serverConfig.adminrole)
				: message.member.roles.cache.has(serverConfig.adminrole);
			if (!perms) return message.channel.send({ embeds: [client.redEmbed(command.required_roles.includes('MODERATOR') ? config.mod_perm : config.admin_perm)] });
		}

	if (command.required_perms?.length > 0) {
		const permsBitfield = Permissions.resolve(command.required_perms);
		if (!message.member?.permissions.has(permsBitfield))
			return message.channel.send({ embeds: [client.redEmbed(config.required_perms + `${command.required_perms.map((p) => `\`${p}\``).join(', ')}`)] });
	}

	if (command.required_args?.length > 0) {
		let requiredArgs: string[] = [];
		command.required_args.forEach(async (arg) => {
			let index = arg.index;
			let type = arg.type;

			if (arg.optional) return;
			if (!args[index] && !arg.optional) return requiredArgs.push(arg.name);

			switch (type) {
				case 'user': {
					let user = message.mentions.users.first() || (await client.users.fetch(args[index]).catch(() => undefined));
					if (!user && !arg.optional) requiredArgs.push(arg.name);
					break;
				}
				case 'member': {
					let member = message.mentions.members?.first() || (await message.guild?.members.fetch(args[index]).catch(() => undefined));
					if (!member && !arg.optional) requiredArgs.push(arg.name);
					break;
				}
				case 'channel': {
					let channel = (message.mentions.channels.first() as GuildChannel) || message.guild?.channels.cache.get(args[index]);
					if (!channel && !arg.optional) requiredArgs.push(arg.name);
					break;
				}
				case 'role':
					{
						let role = message.mentions.roles.first() || message.guild?.roles.cache.get(args[index]) || message.guild?.roles.cache.find((r) => r.name === args[index]);
						if (!role && !arg.optional) requiredArgs.push(arg.name);
					}
					break;
				case 'number':
					if (isNaN(parseInt(args[index])) && !arg.optional) requiredArgs.push(arg.name);
					break;
				default: {
					if (type.includes('|')) {
						let opt = type.split(' | ');
						if (!opt.some((o) => args[index] === o) && !arg.optional) return requiredArgs.push(arg.name);
					}
					break;
				}
			}
		});

		if (requiredArgs.length > 0) return message.channel.send({ embeds: [client.redEmbed(config.required_args + requiredArgs.map((a) => `\`${a}\``).join(', '))] });
	}

	if (command.cooldown > 0) {
		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name) as Collection<string, number>;
		const cooldownAmount = command.cooldown * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send({ embeds: [client.redEmbed(`<@${message.author.id}>, ` + util.cooldown(timeLeft.toFixed(1), command.name))] });
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	try {
		command.execute(client, message, args, serverConfig);
		if (serverConfig.actionslogs === 'none') return;
		setTimeout(() => {
			const logs_channel = message.guild!.channels.cache.get(serverConfig.actionslogs);
			if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;
			const cmdObj = {
				'{user}': message.author.tag,
				'{command}': command!.name,
				'{channel}': `<#${message.channel.id}>`
			};
			return logs_channel.send({ embeds: [client.orangeEmbed(client.replaceEach(config.command_used, cmdObj))] });
		}, 1000);
	} catch (error) {
		client.catchError(error, message.channel as TextChannel);
	}
};
