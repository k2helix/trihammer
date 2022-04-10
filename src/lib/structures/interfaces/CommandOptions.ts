/* eslint-disable semi */
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, PermissionString, SelectMenuInteraction } from 'discord.js';
import Client from '../Client';
import GuildConfig from './GuildConfig';

export default interface CommandOptions {
	name: string;
	description?: string;
	cooldown?: number;
	category?: string;
	required_roles?: ('ADMINISTRATOR' | 'MODERATOR')[];
	required_perms?: PermissionString[];
	client_perms?: PermissionString[];
	execute: (client: Client, interaction: CommandInteraction | SelectMenuInteraction | ButtonInteraction | ContextMenuInteraction, guildConf: GuildConfig) => unknown;
}
