const mongoose = require('mongoose');

let SchemaReminder = new mongoose.Schema({
	id: String,
	reason: String,
	active: Boolean,
	expire: Number
});

let ModelRemind = mongoose.model('reminders', SchemaReminder);

let SchemaMutes = new mongoose.Schema({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

let ModelMutes = mongoose.model('mutes', SchemaMutes);

let SchemaTempbans = new mongoose.Schema({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

let ModelTempban = mongoose.model('tempbans', SchemaTempbans);

let SchemaGuild = new mongoose.Schema({
	server: String,
	modrole: String,
	adminrole: String,
	messagelogs: String,
	voicelogs: String,
	actionslogs: String,
	memberlogs: String,
	serverlogs: String,
	infrlogs: String,
	prefix: String,
	lang: String,
	antispam: Boolean,
	autorole: String
});

let ModelServer = mongoose.model('servers', SchemaGuild);

let SchemaGlobalXP = new mongoose.Schema({
	id: String,
	globalxp: Number,
	pimage: String,
	rimage: String,
	pdesc: String,
	ptext: String,
	rep: Number,
	cooldown: Number,
	repcooldown: Number
});

let ModelUsers = mongoose.model('users', SchemaGlobalXP);

let SchemaNivel = new mongoose.Schema({
	id: String,
	server: String,
	nivel: Number,
	xp: Number
});

let ModelRank = mongoose.model('rank', SchemaNivel);

let SchemaInfrs = new mongoose.Schema({
	key: String,
	id: String,
	server: String,
	duration: String,
	tipo: String,
	time: String,
	mod: String,
	reason: String
});

let ModelInfrs = mongoose.model('infrs', SchemaInfrs);

let SchemaW = new mongoose.Schema({
	server: String,
	canal: String,
	color: String,
	image: String,
	text: String
});

let ModelWelc = mongoose.model('welcomes', SchemaW);

let SchemaLeveledRoles = new mongoose.Schema({
	server: String,
	role: String,
	level: Number
});

let ModelLvlRol = mongoose.model('lvlroles', SchemaLeveledRoles);

let SchemaPlaylists = new mongoose.Schema({
	name: String,
	author: String,
	createdAt: Number,
	timesPlayed: Number,
	songs: [{ name: String, id: String }]
});

let ModelPlaylists = mongoose.model('playlists', SchemaPlaylists);

let SchemaTwitter = new mongoose.Schema({
	server: String,
	channel: String,
	twitter: [{ name: String, id: String }]
});

let ModelTwitter = mongoose.model('twitter', SchemaTwitter);

module.exports = {
	ModelRemind,
	ModelServer,
	ModelUsers,
	ModelRank,
	ModelInfrs,
	ModelWelc,
	ModelLvlRol,
	ModelMutes,
	ModelTempban,
	ModelPlaylists,
	ModelTwitter
};
