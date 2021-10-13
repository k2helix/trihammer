const Twitter = require('twit');
// const { MessageEmbed } = require('discord.js');
const { ModelTwitter } = require('../utils/models');
const T = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// const request = require('request');
// const util = require('util');
// const get = util.promisify(request.get);
// const endpointURL = new URL('https://api.twitter.com/labs/2/tweets/');

// const oAuthConfig = {
// 	consumer_key: process.env.TWITTER_CONSUMER_KEY,
// 	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
// 	token: process.env.TWITTER_ACCESS_TOKEN_KEY,
// 	token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// };

// const params = {
// 	'tweet.fields': 'attachments',
// 	expansions:
// 		'attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id',
// 	'media.fields': 'duration_ms,height,media_key,non_public_metrics,organic_metrics,promoted_metrics,preview_image_url,public_metrics,type,url,width'
// };

async function checkTweets(client) {
	let tweetsToFollow = await ModelTwitter.find().lean();
	let ids = [];
	tweetsToFollow.forEach((tweet) => {
		for (let index = 0; index < tweet.twitter.length; index++) {
			const element = tweet.twitter[index];
			ids.push(element.id);
		}
	});
	try {
		const stream = T.stream('statuses/filter', { follow: ids });
		// const stream = T.stream('statuses/filter', { follow: ['1273009744022822918', '2206903392', '1143818663038017536'] }); //1143818663038017536 alt id

		stream.on('connect', () => {
			console.log('Connecting Twitter => Discord program');
		});

		stream.on('connected', () => {
			console.log('Twitter => Discord program is running');
		});

		stream.on('tweet', async (tweet) => {
			// eslint-disable-next-line curly
			if (tweet.user.screen_name === 'Rezero_official' || tweet.user.screen_name === 'TutoShelter') {
				T.post('favorites/create', { id: tweet.id_str }, function (err) {
					if (err) {
						if (err.code == 139) return;
						console.log(err);
					}
				});
			}
			let models = await ModelTwitter.find({ 'twitter.name': tweet.user.screen_name.toLowerCase() });
			if (!models[0]) return; //mongo id
			let text = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
			let owner = tweet.user.screen_name; //mongo name
			let rt = '';

			// let req = await get({ url: endpointURL + tweet.id_str, oauth: oAuthConfig, qs: params, json: true });

			// let img = undefined;

			// if (req.body.includes.media) img = req.body.includes.media[0].url || req.body.includes.media[0].preview_image_url;

			if (text.toLowerCase().startsWith('rt')) {
				let start = text.indexOf('@');
				let end = text.indexOf(':');
				owner = text.substr(start + 1, end - start - 1);
				rt = `[${tweet.user.screen_name} RT]`;
			}
			// const embed = new MessageEmbed()
			// 	.setAuthor(`${tweet.user.name}`, tweet.user.profile_image_url_https)
			// 	.setTitle('Nuevo Tweet')
			// 	.setURL(`https://twitter.com/${owner}/status/${tweet.id_str}`)
			// 	.setColor('RANDOM')
			// 	.setDescription(text)
			// 	.setTimestamp();
			// if (img) embed.setImage(img);
			models.forEach((model) => {
				let arr = model.twitter;
				let pos = arr
					.map(function (twt) {
						return twt.name;
					})
					.indexOf(tweet.user.screen_name.toLowerCase());
				client.channels.cache.get(model.twitter[pos].channel).send(`${rt} https://twitter.com/${owner}/status/${tweet.id_str}`);
			});
		});

		stream.on('disconnect', (msg) => {
			console.log(`[STREAM] - Disconnect => ${msg}`);
		});
	} catch (err) {
		console.log('Tried getting the stream from twit, returned error: ' + err.message);
	}
}

module.exports = { checkTweets };
