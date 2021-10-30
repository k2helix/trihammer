const { ModelUsers } = require('../../utils/models');
module.exports = {
	name: 'rep',
	description: 'Give a reputation point to a member',
	ESdesc: 'Dale un punto de reputación a un miembro',
	usage: 'rep <user>',
	example: 'rep @user',
	type: 5,
	async execute(client, interaction, guildConf) {
		let user = interaction.options.getUser('user');
		if (user.bot) return;
		let { xp } = require(`../../utils/lang/${guildConf.lang}.js`);
		let author = await ModelUsers.findOne({ id: interaction.user.id });
		// if (args[0] && args[0] === 'reset') {
		// 	let hasVoted = (await reset.has(message.author.id)) ? await reset.get(message.author.id) : false;
		// 	if (hasVoted) return message.channel.send(xp.rep.no_reset);
		// 	try {
		// 		let { body } = await request.get(`https://top.gg/api/bots/611710846426415107/check?userId=` + message.author.id, {
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 				authorization: 'Bearer ' + process.env.DBL_API_KEY
		// 			}
		// 		});
		// 		if (body.voted > 0) {
		// 			author.repcooldown = 0;
		// 			author.save();
		// 			reset.set(message.author.id, true);
		// 			return message.channel.send(xp.rep.reset);
		// 		} else return message.channel.send(xp.rep.no_reset);
		// 	} catch (err) {
		// 		message.channel.send(err.message);
		// 	}
		// }
		let given = await ModelUsers.findOne({ id: user.id });
		if (author.repcooldown > Date.now()) return interaction.reply(xp.rep.cooldown(author.repcooldown - Date.now(), guildConf.prefix));
		else {
			author.repcooldown = Date.now() + 43200000;
			if (user.id === interaction.user.id) return interaction.reply({ content: ':thinking:', ephemeral: true });
			given.rep = given.rep + 1;
			await author.save();
			await given.save();

			let obj = {
				'{author}': interaction.user.username,
				'{user}': user.username
			};
			interaction.reply(xp.rep.added.replaceAll(obj));
		}
	}
};
