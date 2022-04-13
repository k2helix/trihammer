const translate = require('@vitalets/google-translate-api');
let { MessageEmbed } = require('discord.js');
var langs = {
	af: 'Afrikaans',
	sq: 'Albanian',
	am: 'Amharic',
	ar: 'Arabic',
	hy: 'Armenian',
	az: 'Azerbaijani',
	eu: 'Basque',
	be: 'Belarusian',
	bn: 'Bengali',
	bs: 'Bosnian',
	bg: 'Bulgarian',
	ca: 'Catalan',
	ceb: 'Cebuano',
	ny: 'Chichewa',
	'zh-CN': 'Chinese (Simplified)',
	'zh-TW': 'Chinese (Traditional)',
	co: 'Corsican',
	hr: 'Croatian',
	cs: 'Czech',
	da: 'Danish',
	nl: 'Dutch',
	en: 'English',
	eo: 'Esperanto',
	et: 'Estonian',
	tl: 'Filipino',
	fi: 'Finnish',
	fr: 'French',
	fy: 'Frisian',
	gl: 'Galician',
	ka: 'Georgian',
	de: 'German',
	el: 'Greek',
	gu: 'Gujarati',
	ht: 'Haitian Creole',
	ha: 'Hausa',
	haw: 'Hawaiian',
	he: 'Hebrew',
	iw: 'Hebrew',
	hi: 'Hindi',
	hmn: 'Hmong',
	hu: 'Hungarian',
	is: 'Icelandic',
	ig: 'Igbo',
	id: 'Indonesian',
	ga: 'Irish',
	it: 'Italian',
	ja: 'Japanese',
	jw: 'Javanese',
	kn: 'Kannada',
	kk: 'Kazakh',
	km: 'Khmer',
	ko: 'Korean',
	ku: 'Kurdish (Kurmanji)',
	ky: 'Kyrgyz',
	lo: 'Lao',
	la: 'Latin',
	lv: 'Latvian',
	lt: 'Lithuanian',
	lb: 'Luxembourgish',
	mk: 'Macedonian',
	mg: 'Malagasy',
	ms: 'Malay',
	ml: 'Malayalam',
	mt: 'Maltese',
	mi: 'Maori',
	mr: 'Marathi',
	mn: 'Mongolian',
	my: 'Myanmar (Burmese)',
	ne: 'Nepali',
	no: 'Norwegian',
	ps: 'Pashto',
	fa: 'Persian',
	pl: 'Polish',
	pt: 'Portuguese',
	pa: 'Punjabi',
	ro: 'Romanian',
	ru: 'Russian',
	sm: 'Samoan',
	gd: 'Scots Gaelic',
	sr: 'Serbian',
	st: 'Sesotho',
	sn: 'Shona',
	sd: 'Sindhi',
	si: 'Sinhala',
	sk: 'Slovak',
	sl: 'Slovenian',
	so: 'Somali',
	es: 'Spanish',
	su: 'Sundanese',
	sw: 'Swahili',
	sv: 'Swedish',
	tg: 'Tajik',
	ta: 'Tamil',
	te: 'Telugu',
	th: 'Thai',
	tr: 'Turkish',
	uk: 'Ukrainian',
	ur: 'Urdu',
	uz: 'Uzbek',
	vi: 'Vietnamese',
	cy: 'Welsh',
	xh: 'Xhosa',
	yi: 'Yiddish',
	yo: 'Yoruba',
	zu: 'Zulu'
};
const { ModelServer } = require('../../lib/utils/models');
module.exports = {
	name: 'translate',
	description: 'Translate text to other language',
	ESdesc: 'Traduce texto a otro idioma',
	usage: 'translate <lang> <text>',
	example: 'translate es hello how are you',
	cooldown: 3,
	aliases: ['tl'],
	type: 7,
	async execute(client, message, args) {
		const serverConfig: Server = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../lib/utils/lang/${langcode}`);

		if (!args[0]) return;
		if (args[0] === 'list') {
			let all_langs = Object.keys(langs).map((l) => `${l}: ${langs[l]}`);
			return message.channel.send(`\`\`\`js\n${all_langs.join('\n')}\`\`\``);
		}
		let lang = args[0];
		let text = args.slice(1).join(' ');
		if (!Object.keys(langs).includes(lang)) return message.channel.send(`${util.translate.not_found}`);

		if (!text) return;
		let translated = await translate(text, { to: lang });
		let embed = new MessageEmbed()
			.setTitle(util.translate.title)
			.setThumbnail('https://i.pinimg.com/originals/44/10/19/4410197cf5de4fefe413b55860bb617d.png')
			.addField(`${util.translate.from} ${langs[translated.from.language.iso]}:`, `\`\`\`${text.slice(0, 1000)}\`\`\``, true)
			.addField(`${util.translate.to} ${langs[lang]}:`, `\`\`\`${translated.text.slice(0, 1000)}\`\`\``, true);
		message.channel.send({ embeds: [embed] });
	}
};