import { Message, PermissionsString } from 'discord.js';
import Client from './Client';
import GuildConfig from './interfaces/GuildConfig';
import MessageCommandOptions from './interfaces/MessageCommandOptions';

class MessageCommand {
	name: string;
	aliases: string[];
	description: string;
	cooldown: number;
	category: string;
	required_roles: ('ADMINISTRATOR' | 'MODERATOR')[];
	required_args: { index: number; type: 'user' | 'member' | 'channel' | 'role' | 'string' | 'number' | string; name: string; optional?: boolean; ignore?: boolean }[];
	required_perms: PermissionsString[];
	client_perms: PermissionsString[];
	execute: (client: Client, message: Message<true>, args: string[], guildConf: GuildConfig) => unknown;
	constructor(options: MessageCommandOptions) {
		this.name = options.name;
		this.aliases = options.aliases ?? [];
		this.description = options.description || 'No description provided.';
		this.cooldown = options.cooldown ?? 0;
		this.category = options.category ?? 'unknown';

		this.required_args = options.required_args ?? [];
		this.required_roles = options.required_roles ?? [];
		this.required_perms = options.required_perms ?? [];
		this.client_perms = options.client_perms ?? [];

		this.execute = options.execute;
	}
}

export default MessageCommand;
