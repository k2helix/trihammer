import config from '../../../config.json';
import { captureException } from '@sentry/node';
import { Client, ClientOptions, Collection, MessageEmbed, TextChannel } from 'discord.js';
import Command from './Command';
import MessageCommand from './MessageCommand';

type Config = {
	prefix: string;
	administrators: string[];
};

class ExtendedClient extends Client {
	commands = new Collection<string, MessageCommand>();
	interactionCommands = new Collection<string, Command>();
	config: Config;
	constructor(options: ClientOptions, config: Config) {
		super(options);
		this.config = config;
	}

	catchError<T>(error: T, channel: TextChannel) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		console.error(error);
		channel.send({ embeds: [this.redEmbed('An unexpected error ocurred:\n' + `\`${error.message}\``)] });
		(this.channels.cache.get(config.logs_channel) as TextChannel).send(`[ERROR]\`\`\`js\n${error.stack}\`\`\``);
		if (config.use_sentry) captureException(error);
	}

	replaceEach(target: string, obj: { [key: string]: string }) {
		return Object.entries(obj).reduce((result, current) => result.replaceAll(...current), target);
	}

	redEmbed(string: string) {
		return new MessageEmbed().setColor('RED').setDescription(string);
	}

	yellowEmbed(string: string) {
		return new MessageEmbed().setColor('YELLOW').setDescription(string);
	}

	blueEmbed(string: string) {
		return new MessageEmbed().setColor('#0090ff').setDescription(string);
	}

	blackEmbed(string: string) {
		return new MessageEmbed().setDescription(string);
	}

	orangeEmbed(string: string) {
		return new MessageEmbed().setColor('ORANGE').setDescription(string);
	}

	greenEmbed(string: string) {
		return new MessageEmbed().setColor('GREEN').setDescription(string);
	}
}

export default ExtendedClient;
