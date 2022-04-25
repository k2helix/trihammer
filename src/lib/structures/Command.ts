import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, PermissionString, SelectMenuInteraction } from 'discord.js';
import Client from './Client';
import GuildConfig from './interfaces/GuildConfig';
import CommandOptions from './interfaces/CommandOptions';

class Command {
	name: string;
	description: string;
	cooldown: number;
	category: string;
	required_roles: ('ADMINISTRATOR' | 'MODERATOR')[];
	required_perms: PermissionString[];
	client_perms: PermissionString[];
	execute: (client: Client, interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | ContextMenuInteraction, guildConf: GuildConfig) => unknown;
	constructor(options: CommandOptions) {
		this.name = options.name;
		this.description = options.description || 'No description provided.';
		this.cooldown = options.cooldown ?? 0;
		this.category = options.category ?? 'unknown';

		this.required_roles = options.required_roles ?? [];
		this.required_perms = options.required_perms ?? [];
		this.client_perms = options.client_perms ?? [];

		this.execute = options.execute;
	}
}

export default Command;
