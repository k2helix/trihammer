const {
	hiraganaDigraphs,
	hiraganaMonographs,
	katakanaMonographs,
	katakanaDigraphs,
	katakanaHalfwidthsCombined,
	katakanaHalfwidths
} = require('./objects');
const { MessageEmbed } = require('discord.js');
function bulkReplace(str, regex, map) {
	if (arguments.length === 2) {
		map = regex;
		regex = new RegExp(Object.keys(map).join('|'), 'ig');
	}

	return str.replace(regex, function (all) {
		if (all in map) return map[all];

		return all;
	});
}

function fromKana(str) {
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

function T_convertor(ms) {
	let años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	let meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	let dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final1 = '';
	if (años > 0) final1 += años > 1 ? `${años} años, ` : `${años} año, `;
	if (meses > 0) final1 += meses > 1 ? `${meses} meses y ` : `${meses} mes y `;
	if (dias > 0) final1 += dias > 1 ? `${dias} días. ` : `${dias} día. `;
	if (dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} horas, ` : `${horas} hora, `;
	if (dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `;
	if (dias < 1 && segundos > 0) final1 += segundos > 1 ? `${segundos} segundos.` : `${segundos} segundo.`;
	return final1;
}

function convertDate(ms) {
	let date = new Date(ms),
		months = {
			0: 'Enero',
			1: 'Febrero',
			2: 'Marzo',
			3: 'Abril',
			4: 'Mayo',
			5: 'Junio',
			6: 'Julio',
			7: 'Agosto',
			8: 'Septiembre',
			9: 'Octubre',
			10: 'Noviembre',
			11: 'Diciembre'
		},
		days = {
			0: 'Domingo',
			1: 'Lunes',
			2: 'Martes',
			3: 'Miércoles',
			4: 'Jueves',
			5: 'Viernes',
			6: 'Sábado'
		},
		year = date.getFullYear(),
		month = months[date.getMonth()],
		day = date.getDate(),
		wDay = days[date.getDay()],
		hour = date.getHours(),
		minute = date.getMinutes(),
		second = date.getSeconds();
	if (second < 10) second = '0' + second;
	if (minute < 10) minute = '0' + minute;
	if (hour < 10) hour = '0' + hour;

	return `${wDay} ${day} de ${month} de ${year} - ${hour}:${minute}:${second}`;
}

/* eslint-disable no-case-declarations */
function digitalTime(ms) {
	let date = new Date(ms),
		months = {
			0: '1',
			1: '2',
			2: '3',
			3: '4',
			4: '5',
			5: '6',
			6: '7',
			7: '8',
			8: '9',
			9: '10',
			10: '11',
			11: '12'
		},
		year = date.getFullYear(),
		month = months[date.getMonth()],
		day = date.getDate(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		second = date.getSeconds();
	if (second < 10) second = '0' + second;
	if (minute < 10) minute = '0' + minute;
	if (hour < 10) hour = '0' + hour;

	return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) arr.push(undefined);
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
}

function MakeRole(message, name, color, perms) {
	return message.guild.roles.create({
		data: {
			name: name,
			color: color,
			permissions: perms == false ? [] : perms
		},
		reason: 'I need a role to mute people.'
	});
}

function Convert(date) {
	let valid_keys = {
		y: { nombre: 'año(s)', tiempo: 31104000000 },
		t: { nombre: 'mes(es)', tiempo: 2592000000 },
		w: { nombre: 'semana(s)', tiempo: 604800000 },
		d: { nombre: 'día(s)', tiempo: 86400000 },
		h: { nombre: 'hora(s)', tiempo: 3600000 },
		m: { nombre: 'minuto(s)', tiempo: 60000 },
		s: { nombre: 'segundo(s)', tiempo: 1000 }
	};
	if (!date) return;
	let format = date.slice(-1),
		time = date.slice(0, -1);

	if (!valid_keys[format]) return false;
	if (isNaN(time)) return false;
	if (parseInt(time) <= 0) return false;
	return {
		nombre: `${parseInt(time)} ${valid_keys[format].nombre}`,
		tiempo: valid_keys[format].tiempo * parseInt(time)
	};
}

function prinsjoto(message) {
	if (message.guild.id === '603833979996602391') {
		if (message.content.toLowerCase().includes('feo')) message.react('618038981942050826');

		if (message.content.toLowerCase().includes('fbi'))
			message.channel.send('FBI OPEN UP!!!!!!!!', {
				files: [
					{
						attachment: 'https://media1.tenor.com/images/e683152889dc703c77ce5bada1e89705/tenor.gif?itemid=11500735',
						name: 'fbi' + '.gif'
					}
				]
			});

		if (message.content.toLowerCase().includes('papelera'))
			message.channel.send(
				'esto es una papelera japoniense no es nada especial pero es japoniense la gente tira cosas no tienen sentimientos pobre papelera acuérdate de ella',
				{
					files: [
						{
							attachment: 'https://i.imgur.com/mgNoaIl.png',
							name: 'papelera' + '.png'
						}
					]
				}
			);

		if (message.content.toLowerCase().includes('puta'))
			message.channel.send({
				files: [
					{
						attachment: 'https://cdn.discordapp.com/attachments/487962590887149603/673603357545332758/sketch-1580669947883.png',
						name: 'puta.png'
					}
				]
			});

		if (message.content.toLowerCase().includes('g2'))
			message.channel.send('G2 está mamadísimo', {
				files: [
					{
						attachment:
							'https://cdn.discordapp.com/attachments/418590211803578391/612048235728732161/Goga-ganado-Rainbow-Six-Siege_1219688028_133861_1440x600.png',
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
}
function wordOfTheDay(client, channel) {
	var Dictionary = require('japaneasy');
	var dict = new Dictionary({
		dictionary: 'spanish',
		language: null,
		method: 'word',
		encode: 'UTF-8',
		mirror: 'usa',
		timeout: 500
	});
	let { wordList } = require('./objects');
	const translate = require('@vitalets/google-translate-api');

	var schedule = require('node-schedule');

	var rule = new schedule.RecurrenceRule();
	rule.hour = 12;
	rule.minute = 0;

	// eslint-disable-next-line no-unused-vars
	var j = schedule.scheduleJob(rule, function () {
		translate(wordList[Math.floor(Math.random() * wordList.length)], { from: 'en', to: 'ja' }).then((res) => {
			dict(encodeURI(res.text)).then(async function (result) {
				do {
					res = await translate(wordList[Math.floor(Math.random() * wordList.length)], { from: 'en', to: 'ja' });
					result = await dict(encodeURI(res.text));
				} while (result[0] === 'No items were found; try another query.');

				let wordData = result[0];
				let pronunciation = wordData.pronunciation ? wordData.pronunciation : res.text;

				let embed = new MessageEmbed()
					.setTitle('Palabra del día')
					.setColor('RANDOM')
					.setDescription(`La palabra de hoy es... **${res.text}**.`)
					.addField('Traducción:', `${wordData.english[0]}`)
					.addField('Pronunciación:', pronunciation + ` (${fromKana(pronunciation).toLowerCase()})`);
				channel.send({ embeds: [embed] });
				client.channels.cache.get('860655239278624797').send({ embeds: [embed] });
			});
		});
	});
}

module.exports = {
	bulkReplace,
	T_convertor,
	convertDate,
	array_move,
	MakeRole,
	Convert,
	prinsjoto,
	wordOfTheDay,
	digitalTime,
	fromKana
};
