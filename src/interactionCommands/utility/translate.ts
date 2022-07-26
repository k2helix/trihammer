import Command from '../../lib/structures/Command';
import translate from '@vitalets/google-translate-api';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
// eslint-disable-next-line prettier/prettier
type codelang = 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'bs' | 'bg' | 'ca' | 'ceb' | 'ny' | 'zh-CN' | 'zh-TW' | 'co' | 'hr' | 'cs' | 'da' | 'nl' | 'en' | 'eo' | 'et' | 'tl' | 'fi' | 'fr' | 'fy' | 'gl' | 'ka' | 'de' | 'el' | 'gu' | 'ht' | 'ha' | 'haw' | 'he' | 'iw' | 'hi' | 'hmn' | 'hu' | 'is' | 'ig' | 'id' | 'ga' | 'it' | 'ja' | 'jw' | 'kn' | 'kk' | 'km' | 'ko' | 'ku' | 'ky' | 'lo' | 'la' | 'lv' | 'lt' | 'lb' | 'mk' | 'mg' | 'ms' | 'ml' | 'mt' | 'mi' | 'mr' | 'mn' | 'my' | 'ne' | 'no' | 'ps' | 'fa' | 'pl' | 'pt' | 'pa' | 'ro' | 'ru' | 'sm' | 'gd' | 'sr' | 'st' | 'sn' | 'sd' | 'si' | 'sk' | 'sl' | 'so' | 'es' | 'su' | 'sw' | 'sv' | 'tg' | 'ta' | 'te' | 'th' | 'tr' | 'uk' | 'ur' | 'uz' | 'vi' | 'cy' | 'xh' | 'yi' | 'yo' | 'zu';
let langs = {
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

// https://discord.com/developers/docs/reference#locales=
let interactionLocales = {
	'en-GB': 'en',
	'en-US': 'en',
	'es-ES': 'es',
	'pt-BR': 'pt',
	'sv-SE': 'sv'
};
export default new Command({
	name: 'translate',
	description: 'Translate text to other language',
	cooldown: 3,
	category: 'utility',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let lang = (interaction as ChatInputCommandInteraction).options.getString('to');
		let text = (interaction as ChatInputCommandInteraction).options.getString('text');
		if (interaction.isContextMenuCommand()) {
			let message = await interaction.channel!.messages.fetch(interaction.targetId);
			lang = interactionLocales[interaction.locale as 'en-GB' | 'en-US' | 'es-ES' | 'pt-BR' | 'sv-SE'] || interaction.locale;
			text = message.content;
		}
		if (!text || !lang) return interaction.reply({ embeds: [client.redEmbed(util.translate.text_not_found)], ephemeral: true });
		if (lang === 'list') {
			let all_langs = Object.keys(langs).map((l) => `${l}: ${langs[l as codelang]}`);
			return interaction.reply({ content: `\`\`\`js\n${all_langs.join('\n')}\`\`\``, ephemeral: true });
		}
		if (!Object.keys(langs).includes(lang)) return interaction.reply({ embeds: [client.redEmbed(util.translate.not_found)], ephemeral: true });
		let translated = await translate(text, { to: lang });
		let embed = new EmbedBuilder()
			.setTitle(util.translate.title)
			.setThumbnail('https://i.pinimg.com/originals/44/10/19/4410197cf5de4fefe413b55860bb617d.png')
			.addFields(
				{ name: `${util.translate.from} ${langs[translated.from.language.iso as codelang]}:`, value: `\`\`\`${text.slice(0, 1000)}\`\`\``, inline: true },
				{ name: `${util.translate.to} ${langs[lang as codelang]}:`, value: `\`\`\`${translated.text.slice(0, 1000)}\`\`\``, inline: true }
			);

		interaction.reply({ embeds: [embed], ephemeral: interaction.isContextMenuCommand() });
	}
});
