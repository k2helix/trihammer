const { ModelRank } = require('../../lib/utils/models');
const { Permissions } = require('discord.js');
module.exports = {
	name: 'addlevel',
	description: "Set someone's level to x",
	ESdesc: 'Establece el nivel de alguien a x',
	usage: 'setlevel <user> <level>',
	example: 'setlevel @user 12',
	aliases: ['setlevel'],
	type: 5,
	async execute(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((m) => m.user.tag === args.slice(0, args.length - 1).join(' ')) ||
			message.guild.members.cache.get(args[0]);

		let nivel = args[args.length - 1];
		if (!user) return;
		if (user.bot) return message.channel.send('no bots');

		if (!nivel) return;
		if (isNaN(nivel)) return;
		if (nivel.startsWith('-')) return;
		let local = await ModelRank.findOne({ id: user.id, server: message.guild.id });
		if (!local) {
			let newRankModel = new ModelRank({
				id: user.id,
				server: message.guild.id,
				nivel: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		local.nivel = nivel;
		await local.save();
		message.channel.send(':white_check_mark:');
	}
};
