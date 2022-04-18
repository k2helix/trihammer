import MessageCommand from '../../lib/structures/MessageCommand';

function toCodePoint(unicodeSurrogates: string, sep?: string) {
	let r = [],
		c = 0,
		p = 0,
		i = 0;
	while (i < unicodeSurrogates.length) {
		c = unicodeSurrogates.charCodeAt(i++);
		if (p) {
			r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
			p = 0;
		} else if (0xd800 <= c && c <= 0xdbff) p = c;
		else r.push(c.toString(16));
	}
	return r.join(sep || '-');
}

export default new MessageCommand({
	name: 'jumbo',
	description: 'Convert a emoji to a image',
	aliases: ['emoji'],
	category: 'utility',
	client_perms: ['ATTACH_FILES'],
	required_args: [{ index: 0, name: 'emoji', type: 'string' }],
	execute(_client, message, args) {
		if (args[0].startsWith('<')) {
			let emojiRegExp = /<a?:[^:]+:(\d+)>/gm;
			let emojiID = emojiRegExp.exec(args[0])![1];
			let gif = args[0].startsWith('<a:') ? true : false;
			message.channel.send({
				files: [
					{
						attachment: `https://cdn.discordapp.com/emojis/${emojiID}.${gif === true ? 'gif' : 'png'}`,
						name: 'emoji.' + `${gif === true ? 'gif' : 'png'}`
					}
				]
			});
		} else {
			let emoji = toCodePoint(args[0]);

			message.channel.send({
				files: [
					{
						attachment: `https://twemoji.maxcdn.com/v/12.1.3/72x72/${emoji}.png`,
						name: 'emoji' + '.png'
					}
				]
			});
		}
		return;
	}
});
