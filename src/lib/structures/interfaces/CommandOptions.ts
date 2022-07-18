/* eslint-disable semi */
import { CommandInteraction, MessageComponentInteraction, PermissionsString } from 'discord.js';
import Client from '../Client';
import GuildConfig from './GuildConfig';

export default interface CommandOptions {
	name: string;
	description?: string;
	cooldown?: number;
	category?: string;
	required_roles?: ('ADMINISTRATOR' | 'MODERATOR')[];
	required_perms?: PermissionsString[];
	client_perms?: PermissionsString[];
	execute: (client: Client, interaction: CommandInteraction | MessageComponentInteraction, guildConf: GuildConfig) => unknown;
}
