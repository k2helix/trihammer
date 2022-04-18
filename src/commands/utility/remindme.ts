import { ModelRemind, Remind } from '../../lib/utils/models';
import { MessageEmbed } from 'discord.js';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
// let { Convert } = require('../../lib/utils/functions');

function msToTime(ms: number) {
	let years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	let months = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	let days = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((ms % (1000 * 60)) / 1000);

	let endString = '';
	if (years > 0) endString += years > 1 ? `${years}y ` : `${years}y `;
	if (months > 0) endString += months > 1 ? `${months}mo ` : `${months}mo `;
	if (days > 0) endString += days > 1 ? `${days}d ` : `${days}d`;
	if (days < 1 && hours > 0) endString += hours > 1 ? `${hours}h ` : `${hours}h  `;
	if (days < 1 && minutes > 0) endString += minutes > 1 ? `${minutes}min ` : `${minutes}min  `;
	if (days < 1 && seconds > 0) endString += seconds > 1 ? `${seconds}s` : `${seconds}s`;
	return endString;
}
export default new MessageCommand({
	name: 'remindme',
	description: 'Add a reminder',
	aliases: ['radd', 'r-add', 'remind'],
	category: 'utility',
	required_args: [
		{ index: 0, name: 'time', type: 'string' },
		{ index: 1, name: 'reason', type: 'string', optional: true }
	],
	async execute(client, message, args, guildConf) {
		if (!args[0]) return;

		if (args[0] === 'list') {
			let reminders: Remind[] = await ModelRemind.find({ id: message.author.id, active: true }).lean();

			let embed = new MessageEmbed()
				.setTitle('Reminders')
				.setColor('RANDOM')
				.setDescription(
					reminders
						.map((remind) => `**${remind.reason}** - ${msToTime(remind.expire - Date.now())}`)
						.join('\n')
						.slice(0, 4000)
				);
			return message.channel.send({ embeds: [embed] });
		}

		let reason = args.slice(1).join(' ');
		if (!reason) reason = ':v';

		const { util, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let time_v = functions.Convert(args[0]);
		let ms;
		if (!time_v) {
			let date = args[0].split('/');
			if (date.length < 2) return;
			let [day, month, year] = date;
			if (!year) year = new Date(Date.now()).getFullYear().toString();
			if (date.some((n) => isNaN(parseInt(n)))) return message.channel.send('🤔');
			if (year.length !== 4) year = '20' + year;

			let jsDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
			ms = jsDate.getTime();
		} else ms = Date.now() + time_v.tiempo;
		let remind = new ModelRemind({ id: message.author.id, reason: reason, active: true, expire: ms });
		await remind.save();

		message.channel.send({ embeds: [client.lightBlueEmbed(util.remind(reason, args[0]))] });
	}
});
