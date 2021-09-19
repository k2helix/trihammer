function areArgsValid(mainString, targetStrings) {
	if (typeof mainString !== 'string') return false;
	if (!Array.isArray(targetStrings)) return false;
	if (!targetStrings.length) return false;
	if (targetStrings.find((s) => typeof s !== 'string')) return false;
	return true;
}
function compareTwoStrings(first, second) {
	first = first.replace(/\s+/g, '');
	second = second.replace(/\s+/g, '');

	if (!first.length && !second.length) return 1; // if both are empty strings
	if (!first.length || !second.length) return 0; // if only one is empty string
	if (first === second) return 1; // identical
	if (first.length === 1 && second.length === 1) return 0; // both are 1-letter strings
	if (first.length < 2 || second.length < 2) return 0; // if either is a 1-letter string

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

		firstBigrams.set(bigram, count);
	}

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function findBestMatch(mainString, targetStrings) {
	if (!areArgsValid(mainString, targetStrings))
		throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');

	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compareTwoStrings(mainString, currentTargetString);
		ratings.push({ target: currentTargetString, rating: currentRating });
		if (currentRating > ratings[bestMatchIndex].rating) bestMatchIndex = i;
	}

	const bestMatch = ratings[bestMatchIndex];

	return { ratings, bestMatch, bestMatchIndex };
}

let object = {
	usa: 'New_York',
	spain: 'Madrid',
	españa: 'Madrid',
	colombia: 'Bogota',
	venezuela: 'Caracas',
	peru: 'Lima',
	perú: 'Lima',
	chile: 'Santiago',
	'dominican republic': 'Santo Domingo',
	'república dominicana': 'Santo Domingo',
	'republica dominicana': 'Santo Domingo',
	america: 'New York',
	américa: 'New York',
	china: 'Hong Kong',
	rusia: 'Moscow',
	russia: 'Moscow',
	rúsia: 'Moscow',
	europe: 'Brussels',
	europa: 'Brussels',
	inglaterra: 'London',
	england: 'London',
	londres: 'London',
	'puerto rico': 'Puerto_Rico'
};

const moment = require('moment-timezone');
let array = moment.tz.names();
function firstUpperCase(text, split = ' ') {
	return text
		.split(split)
		.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
		.join(' ');
}
module.exports = {
	name: 'time-zone',
	description: 'Get information about the time in another time-zone',
	ESdesc: 'Obtén la hora en otra zona horaria',
	usage: 'time-zone <zone>',
	example: 'time-zone puerto rico',
	aliases: ['timezone'],
	type: 1,
	execute(client, interaction, guildConf) {
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		let inputZone = interaction.options.getString('zone').toLowerCase();
		let zone = object[inputZone] !== undefined ? object[inputZone] : inputZone;
		let timeZone = findBestMatch(zone, array).bestMatch.target;

		const time = moment().tz(timeZone).format('h:mm A');
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';

		let obj = {
			'{country}': `${subMain || sub || main}${parens}`,
			'{time}': time
		};

		return interaction.reply(util.timezone.replaceAll(obj));
	}
};
