import mongoose from 'mongoose';

const SchemaReminder = new mongoose.Schema({
	id: String,
	reason: String,
	active: Boolean,
	expire: Number
});

const ModelRemind = mongoose.model('reminders', SchemaReminder);

const SchemaMutes = new mongoose.Schema({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

const ModelMutes = mongoose.model('mutes', SchemaMutes);

const SchemaTempbans = new mongoose.Schema({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

const ModelTempban = mongoose.model('tempbans', SchemaTempbans);

const SchemaGuild = new mongoose.Schema({
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

const ModelServer = mongoose.model('servers', SchemaGuild);

const SchemaGlobalXP = new mongoose.Schema({
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

const ModelUsers = mongoose.model('users', SchemaGlobalXP);

const SchemaNivel = new mongoose.Schema({
	id: String,
	server: String,
	nivel: Number,
	xp: Number
});

const ModelRank = mongoose.model('rank', SchemaNivel);

const SchemaInfrs = new mongoose.Schema({
	key: String,
	id: String,
	server: String,
	duration: String,
	tipo: String,
	time: String,
	mod: String,
	reason: String
});

const ModelInfrs = mongoose.model('infrs', SchemaInfrs);

const SchemaW = new mongoose.Schema({
	server: String,
	canal: String,
	color: String,
	image: String,
	text: String
});

const ModelWelc = mongoose.model('welcomes', SchemaW);

const SchemaLeveledRoles = new mongoose.Schema({
	server: String,
	role: String,
	level: Number
});

const ModelLvlRol = mongoose.model('lvlroles', SchemaLeveledRoles);

const SchemaPlaylists = new mongoose.Schema({
	name: String,
	author: String,
	createdAt: Number,
	timesPlayed: Number,
	songs: [{ name: String, id: String }]
});

const ModelPlaylists = mongoose.model('playlists', SchemaPlaylists);

const SchemaTwitter = new mongoose.Schema({
	server: String,
	twitter: [{ name: String, id: String, channel: String }]
});

const ModelTwitter = mongoose.model('twitter', SchemaTwitter);

interface Remind {
	id: string;
	reason: string;
	active: boolean;
	expire: number;
}

interface Mutes {
	id: string;
	server: string;
	active: boolean;
	expire: number;
	key: string;
}

interface Tempban {
	id: string;
	server: string;
	active: boolean;
	expire: number;
	key: string;
}

interface Server {
	server: string;
	modrole: string;
	adminrole: string;
	messagelogs: string;
	voicelogs: string;
	actionslogs: string;
	memberlogs: string;
	serverlogs: string;
	infrlogs: string;
	prefix: string;
	lang: string;
	antispam: boolean;
	autorole: string;
}

interface Users {
	id: string;
	globalxp: number;
	pimage: string;
	rimage: string;
	pdesc: string;
	ptext: string;
	rep: number;
	cooldown: number;
	repcooldown: number;
}

interface Rank {
	id: string;
	server: string;
	nivel: number;
	xp: number;
}

interface Infrs {
	key: string;
	id: string;
	server: string;
	duration: string;
	tipo: string;
	time: string;
	mod: string;
	reason: string;
}

interface Welc {
	server: string;
	canal: string;
	color: string;
	image: string;
	text: string;
}

interface LvlRol {
	server: string;
	role: string;
	level: number;
}

interface Playlists {
	name: string;
	author: string;
	createdAt: number;
	timesPlayed: number;
	songs: [{ name: string; id: string }];
}

interface Twitter {
	server: string;
	twitter: [{ name: string; id: string; channel: string }];
}

export {
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
	ModelTwitter,
	Remind,
	Server,
	Users,
	Rank,
	Infrs,
	Welc,
	LvlRol,
	Mutes,
	Tempban,
	Playlists,
	Twitter
};
