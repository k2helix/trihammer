import config from '../../../config.json';
import { captureException } from '@sentry/node';
import { Client, ClientOptions, Collection, EmbedBuilder, TextChannel } from 'discord.js';
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

	catchError<T>(error: T, channel: TextChannel, send = true) {
		if (!(error instanceof Error)) throw new Error('Unexpected non-error thrown');
		if (config.use_sentry) captureException(error);
		console.error(error); // ~~captureException already logs to console~~ not anymore
		if (send) channel.send({ embeds: [this.redEmbed('An unexpected error ocurred:\n' + `\`${error.message}\``)] });
		(this.channels.cache.get(config.logs_channel) as TextChannel).send(`[ERROR]\`\`\`js\n${error.stack}\`\`\``);
	}

	replaceEach(target: string, obj: { [key: string]: string }) {
		return Object.entries(obj).reduce((result, current) => result.replaceAll(...current), target);
	}

	redEmbed(string: string) {
		return new EmbedBuilder().setColor('Red').setDescription(string);
	}

	yellowEmbed(string: string) {
		return new EmbedBuilder().setColor('Yellow').setDescription(string);
	}

	blueEmbed(string: string) {
		return new EmbedBuilder().setColor('#0090ff').setDescription(string);
	}

	lightBlueEmbed(string: string) {
		return new EmbedBuilder().setColor(5814783).setDescription(string);
	}

	blackEmbed(string: string) {
		return new EmbedBuilder().setDescription(string);
	}

	whiteEmbed(string: string) {
		return new EmbedBuilder().setColor('White').setDescription(string);
	}

	orangeEmbed(string: string) {
		return new EmbedBuilder().setColor('Orange').setDescription(string);
	}

	greenEmbed(string: string) {
		return new EmbedBuilder().setColor('Green').setDescription(string);
	}

	loadingEmbed() {
		return new EmbedBuilder().setColor('#5865f2').setImage('https://cdn.discordapp.com/attachments/487962590887149603/999306111360454676/in.gif?size=4096?size=4096');
	}
}

export default ExtendedClient;
