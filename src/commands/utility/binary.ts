import MessageCommand from '../../lib/structures/MessageCommand';

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
export default new MessageCommand({
	name: 'binary',
	description: 'Encode or decode binary text',
	required_args: [
		{ index: 0, type: 'encode | decode', name: 'action', optional: true },
		{ index: 1, type: 'string', name: 'text' }
	],
	category: 'utility',
	execute(_client, message, args) {
		switch (args[0]) {
			case 'decode':
				message.channel.send(decode(args.slice(1).join(' ')));
				break;

			case 'encode':
				message.channel.send(encode(args.slice(1).join(' '), true));
				break;

			default:
				message.channel.send(encode(args.join(' '), true));
				break;
		}
	}
});
