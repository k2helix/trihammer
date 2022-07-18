import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../lib/structures/Command';

function decode(text: string) {
	text = text.replace(/\s+/g, '');
	text = text.match(/.{1,8}/g)!.join(' ');
	return text
		.split(' ')
		.map((m) => String.fromCharCode(parseInt(m, 2)))
		.join('');
}

function encode(string: string, spaces: boolean) {
	function zeroPad(n: string) {
		return '00000000'.slice(String(n).length) + n;
	}
	return string.replace(/[\s\S]/g, (str) => {
		string = zeroPad(str.charCodeAt(0).toString(2));
		return spaces ? `${string} ` : string;
	});
}

export default new Command({
	name: 'binary',
	description: 'Encode or decode binary text',
	category: 'utility',
	execute(_client, interaction) {
		switch ((interaction as ChatInputCommandInteraction).options.getString('action')) {
			case 'decode_binary':
				interaction.reply(decode((interaction as ChatInputCommandInteraction).options.getString('text')!));
				break;

			default:
				interaction.reply(encode((interaction as ChatInputCommandInteraction).options.getString('text')!, true));
				break;
		}
	}
});
