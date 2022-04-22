import { CommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

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

export default new Command({
	name: 'jumbo',
	description: 'Convert a emoji to a image',
	category: 'utility',
	client_perms: ['ATTACH_FILES'],
	execute(_client, interaction) {
		let emoji = (interaction as CommandInteraction).options.getString('emoji')!;
		if (emoji.startsWith('<')) {
			let emojiRegExp = /<a?:[^:]+:(\d+)>/gm;
			let emojiID = emojiRegExp.exec(emoji)![1];
			let gif = emoji.startsWith('<a:') ? true : false;
			interaction.reply({
				files: [
					{
						attachment: `https://cdn.discordapp.com/emojis/${emojiID}.${gif === true ? 'gif' : 'png'}`,
						name: 'emoji.' + `${gif === true ? 'gif' : 'png'}`
					}
				]
			});
		} else {
			let emojiId = toCodePoint(emoji);

			interaction.reply({
				files: [
					{
						attachment: `https://twemoji.maxcdn.com/v/12.1.3/72x72/${emojiId}.png`,
						name: 'emoji' + '.png'
					}
				]
			});
		}
		return;
	}
});
