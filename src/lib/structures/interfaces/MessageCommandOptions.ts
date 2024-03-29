/* eslint-disable semi */
import { Message, PermissionsString } from 'discord.js';
import Client from '../Client';
import GuildConfig from './GuildConfig';

export default interface MessageCommandOptions {
	name: string;
	aliases?: string[];
	description?: string;
	cooldown?: number;
	category?: string;
	required_args?: { index: number; type: 'user' | 'member' | 'channel' | 'role' | 'string' | 'number' | string; name: string; optional?: boolean; ignore?: boolean }[];
	required_roles?: ('MODERATOR' | 'ADMINISTRATOR')[];
	required_perms?: PermissionsString[];
	client_perms?: PermissionsString[];
	execute: (client: Client, message: Message<true>, args: string[], guildConf: GuildConfig) => unknown;
}
