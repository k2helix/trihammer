import { findBestMatch } from '../../lib/utils/functions';

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment-timezone');
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
let array = moment.tz.names();
function firstUpperCase(text: string, split: string | RegExp = ' ') {
	return text
		.split(split)
		.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
		.join(' ');
}
export default new MessageCommand({
	name: 'time-zone',
	description: 'Get information about the time in another time-zone',
	aliases: ['timezone'],
	category: 'utility',
	required_args: [{ index: 0, name: 'zone', type: 'string' }],
	async execute(client, message, args, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		//@ts-ignore
		let zone = object[args.join(' ').toLowerCase()] !== undefined ? object[args.join(' ').toLowerCase()] : args.join(' ').toLowerCase();
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

		return message.channel.send({ embeds: [client.lightBlueEmbed(client.replaceEach(util.timezone, obj))] });
	}
});
