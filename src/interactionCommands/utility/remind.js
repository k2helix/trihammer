const { ModelRemind } = require('../../utils/models');
let { MessageEmbed } = require('discord.js');
let { Convert } = require('../../utils/functions');

function msToTime(ms) {
	let años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	let meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	let dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final1 = '';
	if (años > 0) final1 += años > 1 ? `${años}y ` : `${años}y `;
	if (meses > 0) final1 += meses > 1 ? `${meses}mo ` : `${meses}mo `;
	if (dias > 0) final1 += dias > 1 ? `${dias}d ` : `${dias}d`;
	if (dias < 1 && horas > 0) final1 += horas > 1 ? `${horas}h ` : `${horas}h  `;
	if (dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos}min ` : `${minutos}min  `;
	if (dias < 1 && segundos > 0) final1 += segundos > 1 ? `${segundos}s` : `${segundos}s`;
	return final1;
}
module.exports = {
	name: 'remind',
	description: 'Add a reminder',
	ESdesc: 'Añade un recordatorio',
	usage: 'remindme [list] <time> [reason]',
	example: 'remindme 1h add a new command\nremindme 1h do homework\nremindme list',
	aliases: ['radd', 'r-add', 'remindme'],
	type: 1,
	async execute(client, interaction, guildConf) {
		// return console.log(interaction.options.data[0].name)

		if (interaction.options.data[0].name === 'list') {
			let reminders = await ModelRemind.find({ id: interaction.user.id, active: true }).lean();

			let embed = new MessageEmbed()
				.setTitle('Reminders')
				.setColor('RANDOM')
				.setDescription(reminders.map((remind) => `**${remind.reason}** - ${msToTime(remind.expire - Date.now())}`).join('\n'));
			return interaction.reply({ embeds: [embed] });
		}

		let motivo = interaction.options.getString('reminder');
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);

		let time_v = Convert(interaction.options.getString('time'));
		let ms = Date.now() + time_v.tiempo;
		// if (!time_v) {
		// 	let date = args[0].split('/');
		// 	if (date.length < 2) return;
		// 	let [day, month, year] = date;
		// 	if (!year) year = new Date(Date.now()).getFullYear();
		// 	if (date.some((n) => isNaN(n))) return message.channel.send('🤔');
		// 	if (year.length !== 4) year = '20' + year;

		// 	let jsDate = new Date(year, month - 1, day);
		// 	ms = jsDate.getTime();
		// } else ms = Date.now() + time_v.tiempo;
		let remind = new ModelRemind({ id: interaction.user.id, reason: motivo, active: true, expire: ms });
		await remind.save();

		interaction.reply(util.remind(motivo, interaction.options.getString('time')));
	}
};
