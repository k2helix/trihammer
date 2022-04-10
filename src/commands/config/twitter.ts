/* eslint-disable require-await */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
// const { ModelTwitter, ModelServer } = require('../../lib/utils/models');
// const Twitter = require('twit');
// const { Permissions } = require('discord.js');
// const T = new Twitter({
// 	consumer_key: process.env.TWITTER_CONSUMER_KEY,
// 	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
// 	access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
// 	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });
module.exports = {
	name: 'twitter',
	description: 'Send a message when someone you want posts a tweet',
	ESdesc: 'Envía un mensaje cuando alguien que quieras pone un tweet',
	usage: 'twitter <follow | unfollow> username channel',
	example: 'twitter follow WillyrexYT #twitter\ntwitter unfollow WillyrexYT #twitter',
	aliases: ['twt'],
	type: 3,
	async execute(client, message, args) {
		return message.channel.send('Command disabled.');
		// let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		// let { config } = require(`../../lib/utils/lang/${serverConfig.lang}`);
		// if (!args[0]) return;

		// let permiso = serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
		// if (!permiso) return message.channel.send(config.admin_perm);
		// switch (args[0]) {
		// 	case 'follow':
		// 		let username = args[1].toLowerCase();
		// 		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

		// 		if (!username) return;
		// 		if (!channel) return;
		// 		// eslint-disable-next-line no-unused-vars
		// 		T.get('/users/lookup', { screen_name: username }, async function (err, data, response) {
		// 			if (data.errors) return message.channel.send(data.errors[0].message);
		// 			let id = data[0].id_str;

		// 			let twitter = await ModelTwitter.findOne({ server: message.guild.id });
		// 			if (!twitter) {
		// 				let newTwitterModel = new ModelTwitter({
		// 					server: message.guild.id,
		// 					twitter: [{ name: username, id: id, channel: channel.id }]
		// 				});
		// 				await newTwitterModel.save();
		// 				twitter = newTwitterModel;
		// 			} else {
		// 				twitter.twitter.push({ name: username, id: id, channel: channel.id });
		// 				twitter.save();
		// 			}
		// 			message.channel.send(config.twitter.follow(username, channel, id));
		// 		});
		// 		break;

		// 	case 'unfollow':
		// 		let userName = args[1].toLowerCase();
		// 		let Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

		// 		if (!userName) return;
		// 		if (!Channel) return;

		// 		let Twitter = await ModelTwitter.findOne({ server: message.guild.id });
		// 		if (!Twitter) return message.channel.send(config.twitter.not_following);

		// 		let newArray = Twitter.twitter.filter((t) => t.name !== userName && t.channel !== Channel.id);
		// 		if (Twitter.twitter == newArray) return message.channel.send(config.twitter.not_following);
		// 		Twitter.twitter = newArray;
		// 		Twitter.save();

		// 		message.channel.send(config.twitter.unfollow(userName));
		// 		break;
		// }
	}
};
