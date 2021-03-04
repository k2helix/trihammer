const { ModelServer, ModelRemind } = require('../../utils/models');
let { MessageEmbed } = require('discord.js');
let { Convert } = require('../../utils/methods/functions');

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
	name: 'remindme',
	description: 'Add a reminder',
	ESdesc: 'Añade un recordatorio',
	usage: 'remindme [list] <time> [reason]',
	example: 'remindme 1h add a new command\nremindme list',
	aliases: ['radd', 'r-add', 'remind'],
	type: 1,
	async execute(client, message, args) {
		if (!args[0]) return;

		if (args[0] === 'list') {
			let reminders = await ModelRemind.find({ id: message.author.id, active: true }).lean();

			let embed = new MessageEmbed()
				.setTitle('Reminders')
				.setColor('RANDOM')
				.setDescription(reminders.map((remind) => `**${remind.reason}** - ${msToTime(remind.expire - Date.now())}`).join('\n'));
			message.channel.send(embed);
		}

		let motivo = args.slice(1).join(' ');
		if (!motivo) motivo = ':v';

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		let time_v = Convert(args[0]);
		if (!time_v) return;

		let remind = new ModelRemind({ id: message.author.id, reason: motivo, active: true, expire: Date.now() + time_v.tiempo });
		await remind.save();

		message.channel.send(util.remind(motivo, args[0]));
	}
};
