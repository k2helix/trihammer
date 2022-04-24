/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inspect } from 'util';
const util = require('../../lib/utils/functions');
const queue = require('../../lib/modules/music');
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'eval',
	description: 'only admin',
	category: 'unknown',
	execute(client, message, args) {
		if (!client.config.administrators.includes(message.author.id)) return;
		function clean(text: string | unknown) {
			if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			else return text;
		}
		let depthTo = args.indexOf('-depth') > -1 ? args[args.indexOf('-depth') + 1] : '0';
		// eslint-disable-next-line curly
		try {
			const code = parseInt(depthTo) > 0 ? args.slice(0, args.lastIndexOf(depthTo) - 1).join(' ') : args.join(' ');
			let evaled = code.includes('await') ? eval(`(async () => {${code}})()`) : eval(code);

			if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: parseInt(depthTo) });

			message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
});

util;
queue;
