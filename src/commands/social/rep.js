const db = require('megadb');
const reset = new db.crearDB('reset');
const request = require('node-superfetch');
const config = require('../../../config.json');

const { ModelUsers, ModelServer } = require('../../utils/models');
module.exports = {
	name: 'rep',
	description: 'Give a reputation point to a member',
	ESdesc: 'Dale un punto de reputación a un miembro',
	usage: 'rep <user>',
	example: 'rep @user',
	type: 5,
	async execute(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!user) return;

		if (user.bot) return;
		let serverConfig = await ModelServer.findOne({ server: message.guild.id });
		let langcode = serverConfig.lang;
		let prefix = serverConfig.prefix;
		let { xp } = require(`../../utils/lang/${langcode}.js`);
		let author = await ModelUsers.findOne({ id: message.author.id });
		if (config['top.gg'])
			if (args[0] && args[0] === 'reset') {
				let hasVoted = (await reset.has(message.author.id)) ? await reset.get(message.author.id) : false;
				if (hasVoted) return message.channel.send(xp.rep.no_reset);
				try {
					let { body } = await request.get(`https://top.gg/api/bots/${client.user.id}/check?userId=` + message.author.id, {
						headers: {
							'Content-Type': 'application/json',
							authorization: 'Bearer ' + process.env.DBL_API_KEY
						}
					});
					if (body.voted > 0) {
						author.repcooldown = 0;
						author.save();
						reset.set(message.author.id, true);
						return message.channel.send(xp.rep.reset);
					} else return message.channel.send(xp.rep.no_reset);
				} catch (err) {
					message.channel.send(err.message);
				}
			}

		if (!user) return message.channel.send(xp.rep.user);
		let given = await ModelUsers.findOne({ id: user.id });
		if (author.repcooldown > Date.now()) return message.channel.send(xp.rep.cooldown(author.repcooldown - Date.now(), prefix));
		else {
			author.repcooldown = Date.now() + 43200000;
			if (user.id === message.author.id) return message.channel.send(':thinking:');
			given.rep = given.rep + 1;
			await author.save();
			await given.save();

			let obj = {
				'{author}': message.author.username,
				'{user}': user.user.username
			};
			message.channel.send(xp.rep.added.replaceAll(obj));
		}
	}
};
