import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from '../config.json';
import Client from './lib/structures/Client';
import { join } from 'path';
import { GatewayIntentBits, Options, TextChannel } from 'discord.js';
import { readdir, readdirSync } from 'fs';
import { captureException, init } from '@sentry/node';
import MessageCommand from './lib/structures/MessageCommand';
import Command from './lib/structures/Command';

dotenv.config();

const keys = Object.keys(config.credentials) as (keyof typeof config.credentials)[];
if (!config.credentials.dotenv)
	keys.forEach((key) => {
		if (key === 'dotenv') return;
		process.env[key] = config.credentials[key];
	});

if (config.use_sentry) init({ dsn: process.env.SENTRY_DSN });
mongoose.connect(process.env.MONGO_URI!, {
	socketTimeoutMS: 0,
	connectTimeoutMS: 0,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;

//@ts-ignore
db.on('error', console.error.bind(console, 'connection error:'));
//@ts-ignore
db.once('open', function () {
	console.log(`[MONGO_DB] Connected succesfully`);
});

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
];
const client = new Client(
	{
		allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
		intents: intents,
		makeCache: Options.cacheWithLimits({
			DMMessageManager: 200,
			GuildMessageManager: 200
		})
	},
	{ prefix: config.default_prefix, administrators: config.administrators }
);


// require('./lib/modules/twitter').checkTweets(client);

// const array = ['Mod', 'xp', 'Utilidad', 'Kawaii', 'config', 'Music'];

config.enabled_commands.forEach(async (dir) => {
	const commandFiles = readdirSync(join(__dirname, 'commands', dir)).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		let { default: command } = await import(join(__dirname, 'commands', dir, file));
		if (command.default instanceof MessageCommand) {
			command = Object.assign(command.default, command);
			delete command.default;
		}
		client.commands.set(command.name, command);
	}

	if (dir !== 'development') {
		const interactionCommandFiles = readdirSync(join(__dirname, 'interactionCommands', dir)).filter((file) => file.endsWith('.js'));
		for (const file of interactionCommandFiles) {
			let command = await import(join(__dirname, 'interactionCommands', dir, file));
			if (command.default instanceof Command) {
				command = Object.assign(command.default, command);
				delete command.default;
			}
			client.interactionCommands.set(command.name, command);
		}
	}
});

readdir(join(__dirname, 'events'), (err, files) => {
	if (err) return console.error(err);
	files.forEach(async (file) => {
		if (!file.endsWith('.js') || file.endsWith('.map')) return;
		let evt = await import(join(__dirname, 'events', file));
		const evtName = file.split('.')[0];

		if (evt.default instanceof Function) {
			evt = Object.assign(evt.default, evt);
			delete evt.default;
		}

		try {
			client.on(evtName, evt.bind(null, client));
		} catch (e) {
			console.error(`[Event Handler] ${e}`);
		} finally {
			delete require.cache[join(__dirname, 'events')];
		}
	});
});

process.on('unhandledRejection', (error: Error) => {
	if (config.use_sentry) captureException(error);
	else console.error(error);
	(client.channels.cache.get(config.logs_channel) as TextChannel).send(`[ERROR]\`\`\`js\n${error.stack}\`\`\``);
});

client.login(process.env.TOKEN);
