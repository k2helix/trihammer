require('dotenv').config();
const config = require('../config.json');
if (!config.credentials.dotenv)
	Object.keys(config.credentials).forEach((key) => {
		if (key === 'dotenv') return;
		process.env[key] = config.credentials[key];
	});

const { init, captureException } = require('@sentry/node');
if (config.use_sentry) init({ dsn: process.env.SENTRY_DSN });

const mongoose = require(`mongoose`);
mongoose.connect(process.env.MONGO_URI, {
	socketTimeoutMS: 0,
	connectTimeoutMS: 0,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log(`[MONGO_DB] Connected succesfully`);
});

const Discord = require('discord.js');
const fs = require('fs');

const intents = [
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_MEMBERS,
	Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	Discord.Intents.FLAGS.GUILD_MESSAGES,
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS //quitar mas tarde
];
const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: intents });
client.commands = new Discord.Collection();
client.interactionCommands = new Discord.Collection();
client.config = { prefix: config.default_prefix, admins: config.administrators };

// require('./modules/twitter').checkTweets(client);

// const array = ['Mod', 'xp', 'Utilidad', 'Kawaii', 'config', 'Music'];
const array = ['config', 'development', 'fun', 'information', 'moderation', 'music', 'social', 'utility'];

array.forEach((arr) => {
	const commandFiles = fs.readdirSync('./src/commands/' + arr).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${arr}/${file}`);
		client.commands.set(command.name, command);
	}

	const interactionCommandFiles = fs.readdirSync('./src/interactionCommands/' + arr).filter((file) => file.endsWith('.js'));
	for (const file of interactionCommandFiles) {
		const command = require(`./interactionCommands/${arr}/${file}`);
		client.interactionCommands.set(command.name, command);
	}
});

fs.readdir('./src/events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		const evt = require(`./events/${file}`);
		let evtName = file.split('.')[0];
		// if (evtName !== 'ready' && evtName !== 'message') return;
		client.on(evtName, evt.bind(null, client));
	});
});

process.on('unhandledRejection', (error) => {
	console.error(error);
	client.channels.cache.get(config.logs_channel).send(`[ERROR]\`\`\`js\n${error.stack}\`\`\``);
	if (config.use_sentry) captureException(error);
});

client.login(process.env.TOKEN);
