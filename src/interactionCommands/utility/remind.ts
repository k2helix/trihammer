import { ModelRemind, Remind } from '../../lib/utils/models';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
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
export default new Command({
	name: 'remind',
	description: 'Add a reminder',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		if ((interaction as CommandInteraction).options.data[0].name === 'list') {
			let reminders: Remind[] = await ModelRemind.find({ id: interaction.user.id, active: true }).lean();

			let embed = new MessageEmbed()
				.setTitle('Reminders')
				.setColor('RANDOM')
				.setDescription(reminders.map((remind) => `**${remind.reason}** - ${msToTime(remind.expire - Date.now())}`).join('\n'));
			return interaction.reply({ embeds: [embed] });
		}

		let reason = (interaction as CommandInteraction).options.getString('reminder')!;

		const { util, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let timeString = (interaction as CommandInteraction).options.getString('time')!;
		let time_v = functions.Convert(timeString);
		let ms;
		if (!time_v) {
			let date = timeString.split('/');
			if (date.length < 2) return;
			let [day, month, year] = date;
			if (!year) year = new Date(Date.now()).getFullYear().toString();
			if (date.some((n) => isNaN(parseInt(n)))) return interaction.reply('🤔');
			if (year.length !== 4) year = '20' + year;

			let jsDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
			ms = jsDate.getTime();
		} else ms = Date.now() + time_v.tiempo;
		let remind = new ModelRemind({ id: interaction.user.id, reason: reason, active: true, expire: ms });
		await remind.save();

		interaction.reply({ embeds: [client.lightBlueEmbed(util.remind(reason, timeString))] });
	}
});
