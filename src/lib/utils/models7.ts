import mongoose from 'mongoose';

// Reminders
interface Remind {
	id: string;
	reason: string;
	active: boolean;
	expire: number;
}

const SchemaReminder = new mongoose.Schema<Remind>({
	id: String,
	reason: String,
	active: Boolean,
	expire: Number
});

const ModelRemind = mongoose.model<Remind>('reminders', SchemaReminder);

// Mutes
interface Mutes {
	id: string;
	server: string;
	active: boolean;
	expire: number;
	key: string;
}

const SchemaMutes = new mongoose.Schema<Mutes>({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

const ModelMutes = mongoose.model<Mutes>('mutes', SchemaMutes);

// Tempbans
interface Tempban {
	id: string;
	server: string;
	active: boolean;
	expire: number;
	key: string;
}

const SchemaTempbans = new mongoose.Schema<Tempban>({
	id: String,
	server: String,
	active: Boolean,
	expire: Number,
	key: String
});

const ModelTempban = mongoose.model<Tempban>('tempbans', SchemaTempbans);

// Servers
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

const SchemaGuild = new mongoose.Schema<Server>({
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

const ModelServer = mongoose.model<Server>('servers', SchemaGuild);

// Global Users
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

const SchemaGlobalXP = new mongoose.Schema<Users>({
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

const ModelUsers = mongoose.model<Users>('users', SchemaGlobalXP);

// Ranks
interface Rank {
	id: string;
	server: string;
	nivel: number;
	xp: number;
}

const SchemaNivel = new mongoose.Schema<Rank>({
	id: String,
	server: String,
	nivel: Number,
	xp: Number
});

const ModelRank = mongoose.model<Rank>('rank', SchemaNivel);

// Infractions
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

const SchemaInfrs = new mongoose.Schema<Infrs>({
	key: String,
	id: String,
	server: String,
	duration: String,
	tipo: String,
	time: String,
	mod: String,
	reason: String
});

const ModelInfrs = mongoose.model<Infrs>('infrs', SchemaInfrs);

// Welcomes
interface Welc {
	server: string;
	canal: string;
	color: string;
	image: string;
	text: string;
}

const SchemaW = new mongoose.Schema<Welc>({
	server: String,
	canal: String,
	color: String,
	image: String,
	text: String
});

const ModelWelc = mongoose.model<Welc>('welcomes', SchemaW);

// Leveled roles
interface LvlRol {
	server: string;
	role: string;
	level: number;
}

const SchemaLeveledRoles = new mongoose.Schema<LvlRol>({
	server: String,
	role: String,
	level: Number
});

const ModelLvlRol = mongoose.model<LvlRol>('lvlroles', SchemaLeveledRoles);

// Music Playlists
interface Playlists {
	name: string;
	author: string;
	createdAt: number;
	timesPlayed: number;
	songs: [{ name: string; id: string }];
}

const SchemaPlaylists = new mongoose.Schema<Playlists>({
	name: String,
	author: String,
	createdAt: Number,
	timesPlayed: Number,
	songs: [{ name: String, id: String }]
});

const ModelPlaylists = mongoose.model<Playlists>('playlists', SchemaPlaylists);

// Twitter
interface Twitter {
	server: string;
	twitter: [{ name: string; id: string; channel: string }];
}

const SchemaTwitter = new mongoose.Schema<Twitter>({
	server: String,
	twitter: [{ name: String, id: String, channel: String }]
});

const ModelTwitter = mongoose.model<Twitter>('twitter', SchemaTwitter);

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
