require('dotenv').config();

const { init, captureException } = require('@sentry/node');
init({ dsn: process.env.SENTRY_DSN });

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

const intents = new Discord.Intents([Discord.Intents.NON_PRIVILEGED, 'GUILD_MEMBERS']);
const client = new Discord.Client({ disableMentions: 'everyone', ws: { intents } });
client.commands = new Discord.Collection();
client.config = { prefix: 't-', admins: ['461279654158925825', '638693695839010836'] };

require('./utils/methods/stream').checkTweets(client);

const array = ['Mod', 'xp', 'Utilidad', 'Kawaii', 'config', 'Music'];

array.some((arr) => {
	const commandFiles = fs.readdirSync('./src/commands/' + arr).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${arr}/${file}`);
		client.commands.set(command.name, command);
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
	client.channels.cache.get('640548372574371852').send(`[ERROR]\`\`\`js\n${error.stack}\`\`\``);
	captureException(error);
});

client.login(process.env.TOKEN);