/* eslint-disable no-unused-vars */
const { inspect } = require('util');
const util = require('../../utils/functions');
const queue = require('../../modules/music');
module.exports = {
	name: 'eval',
	description: 'only admin',
	ESdesc: 'SOLO ADMIN DIJE',
	usage: 'only admin',
	example: 'only admin',
	type: -1,
	execute(client, message, args) {
		if (!client.config.admins.includes(message.author.id)) return;
		function clean(text) {
			if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			else return text;
		}
		let depthTo = args.indexOf('-depth') > -1 ? args[args.indexOf('-depth') + 1] : 0;
		// eslint-disable-next-line curly
		try {
			const code = depthTo > 0 ? args.slice(0, args.lastIndexOf(depthTo) - 1).join(' ') : args.join(' ');
			let evaled = code.includes('await') ? eval(`(async () => {${code}})()`) : eval(code);

			if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: depthTo });

			message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
};
