import { wordList } from './objects';
import translate from 'google-translate-api-x';
import { hiraganaDigraphs, hiraganaMonographs, katakanaDigraphs, katakanaHalfwidths, katakanaHalfwidthsCombined, katakanaMonographs } from './objects';
import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import ExtendedClient from '../structures/Client';
//@ts-ignore
function bulkReplace(str: string, regex, map?) {
	if (arguments.length === 2) {
		map = regex;
		regex = new RegExp(Object.keys(map).join('|'), 'ig');
	}

	return str.replace(regex, function (all) {
		if (all in map) return map[all];

		return all;
	});
}

function fromKana(str: string) {
	str = bulkReplace(str, katakanaHalfwidthsCombined);
	str = bulkReplace(str, katakanaHalfwidths);
	str = bulkReplace(str, hiraganaDigraphs);
	str = bulkReplace(str, katakanaDigraphs);
	str = bulkReplace(str, hiraganaMonographs);
	str = bulkReplace(str, katakanaMonographs);

	str = str.replace(/[っッ]C/g, 'TC').replace(/[っッ](.)/g, '$1$1');

	str = str.replace(/[NM]'([^YAEIOU]|$)/g, 'N$1');

	str = str.replace(/Aー/g, 'Ā');
	str = str.replace(/Iー/g, 'Ī');
	str = str.replace(/Uー/g, 'Ū');
	str = str.replace(/Eー/g, 'Ē');
	str = str.replace(/Oー/g, 'Ō');

	return str;
}

function digitalTime(ms: number) {
	const date = new Date(ms),
		year = date.getFullYear().toString(),
		month = (date.getMonth() + 1).toString(),
		day = date.getDate().toString(),
		hour = date.getHours().toString().padStart(2, '0'),
		minute = date.getMinutes().toString().padStart(2, '0'),
		second = date.getSeconds().toString().padStart(2, '0');

	return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

function array_move(arr: unknown[], old_index: number, new_index: number) {
	if (new_index >= arr.length) {
		let k = new_index - arr.length + 1;
		while (k--) arr.push(undefined);
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
}

function prinsjoto(message: Message) {
	if (message.content.toLowerCase().includes('feo')) message.react('618038981942050826');

	if (message.content.toLowerCase().includes('fbi'))
		message.channel.send({
			content: 'FBI OPEN UP!!!!!!!!',
			files: [
				{
					attachment: 'https://media1.tenor.com/images/e683152889dc703c77ce5bada1e89705/tenor.gif?itemid=11500735',
					name: 'fbi' + '.gif'
				}
			]
		});

	if (message.content.toLowerCase().includes('papelera'))
		message.channel.send({
			content: 'esto es una papelera japoniense no es nada especial pero es japoniense la gente tira cosas no tienen sentimientos pobre papelera acuérdate de ella',
			files: [
				{
					attachment: 'https://i.imgur.com/mgNoaIl.png',
					name: 'papelera' + '.png'
				}
			]
		});

	if (message.content.toLowerCase().includes('puta'))
		message.channel.send({
			files: [
				{
					attachment: 'https://cdn.discordapp.xyz/attachments/487962590887149603/673603357545332758/sketch-1580669947883.png',
					name: 'puta.png'
				}
			]
		});

	if (message.content.toLowerCase().includes('g2'))
		message.channel.send({
			content: 'G2 está mamadísimo',
			files: [
				{
					attachment: 'https://cdn.discordapp.xyz/attachments/418590211803578391/612048235728732161/Goga-ganado-Rainbow-Six-Siege_1219688028_133861_1440x600.png',
					name: 'G2mamadisimo' + '.png'
				}
			]
		});

	if (message.content.toLowerCase().includes('puto'))
		message.channel.send({
			files: [
				{
					attachment: 'https://i.imgur.com/9Pvl5bA.png',
					name: 'puto' + '.png'
				}
			]
		});
}
function wordOfTheDay(client: ExtendedClient, channel: TextChannel) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const Dictionary = require('japaneasy');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const schedule = require('node-schedule');
	const dict = new Dictionary({
		dictionary: 'spanish',
		language: null,
		method: 'word',
		encode: 'UTF-8',
		mirror: 'usa',
		timeout: 500
	});

	const rule = new schedule.RecurrenceRule();
	rule.hour = 12;
	rule.minute = 0;

	schedule.scheduleJob(rule, function () {
		translate(wordList[Math.floor(Math.random() * wordList.length)], { from: 'en', to: 'ja' }).then((res) => {
			//@ts-ignore
			dict(encodeURI(res.text)).then(async function (result) {
				do {
					res = await translate(wordList[Math.floor(Math.random() * wordList.length)], { from: 'en', to: 'ja' });
					result = await dict(encodeURI(res.text));
				} while (result[0] === 'No items were found; try another query.');

				const wordData = result[0];
				const pronunciation = wordData.pronunciation ? wordData.pronunciation : res.text;

				const embed = new EmbedBuilder()
					.setTitle('Palabra del día')
					.setColor('Random')
					.setDescription(`La palabra de hoy es... **${res.text}**.`)
					.addFields(
						{ name: 'Traducción:', value: `${wordData.english[0]}` },
						{ name: 'Pronunciación:', value: pronunciation + ` (${fromKana(pronunciation).toLowerCase()})` }
					);
				channel.send({ embeds: [embed] });
				(client.channels.cache.get('860655239278624797') as TextChannel)?.send({ embeds: [embed] });
			});
		});
	});
}

function swap(array: unknown[], x: number, y: number) {
	const b = array[x];
	array[x] = array[y];
	array[y] = b;
	return array;
}

// taken from the npm package "string-similarity" developed by aceakash
function compareTwoStrings(first: string, second: string) {
	first = first.replace(/\s+/g, '');
	second = second.replace(/\s+/g, '');

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

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

function findBestMatch(mainString: string, targetStrings: string[]) {
	if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');

	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compareTwoStrings(mainString, currentTargetString);
		ratings.push({ target: currentTargetString, rating: currentRating });
		if (currentRating > ratings[bestMatchIndex].rating) bestMatchIndex = i;
	}

	const bestMatch = ratings[bestMatchIndex];

	return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex };
}

function areArgsValid(mainString: string, targetStrings: string[]) {
	if (typeof mainString !== 'string') return false;
	if (!Array.isArray(targetStrings)) return false;
	if (!targetStrings.length) return false;
	if (
		targetStrings.find(function (s) {
			return typeof s !== 'string';
		})
	)
		return false;
	return true;
}

// taken from https://stackoverflow.com/questions/2692323/code-golf-friendly-number-abbreviator
function abbrNum(number: number, decPlaces: number): string {
	// 2 decimal places => 100, 3 => 1000, etc
	decPlaces = Math.pow(10, decPlaces);

	// Enumerate number abbreviations
	let abbrev = ['K', 'M', 'B', 'T'];

	// Go through the array backwards, so we do the largest first
	for (let i = abbrev.length - 1; i >= 0; i--) {
		// Convert array index to "1000", "1000000", etc
		let size = Math.pow(10, (i + 1) * 3);

		// If the number is bigger or equal do the abbreviation
		if (size <= number) {
			// Here, we multiply by decPlaces, round, and then divide by decPlaces.
			// This gives us nice rounding to a particular decimal place.
			number = Math.round((number * decPlaces) / size) / decPlaces;

			// Add the letter for the abbreviation
			// @ts-ignore
			number += abbrev[i];

			// We are done... stop
			break;
		}
	}

	return number.toString();
}

function shuffle(array: unknown[]) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
export { abbrNum, bulkReplace, array_move, prinsjoto, wordOfTheDay, digitalTime, fromKana, shuffle, swap, findBestMatch, compareTwoStrings };
