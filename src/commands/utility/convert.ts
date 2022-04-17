import math from 'mathjs';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
function formatNumber(number: string | number, minimumFractionDigits = 0) {
	return Number.parseFloat(number as string).toLocaleString(undefined, {
		minimumFractionDigits,
		maximumFractionDigits: 2
	});
}
export default new MessageCommand({
	name: 'convert',
	description: 'Convert units to other units',
	aliases: ['units', 'conver-units'],
	category: 'utility',
	required_args: [
		{ index: 0, name: 'amount', type: 'number' },
		{ index: 1, name: 'base-unit', type: 'string' },
		{ index: 2, name: 'target-unit', type: 'string' }
	],
	async execute(client, message, args, guildConf) {
		const amount = args[0];
		const base = args[1];
		const target = args[2];

		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!amount) return message.channel.send({ embeds: [client.redEmbed(util.convert.need.replace('{prefix}', guildConf.prefix))] });
		try {
			const value = math.unit(Number(amount), base).toNumber(target);

			let obj = {
				'{amount}': formatNumber(amount),
				'{base}': base,
				'{number}': formatNumber(value),
				'{target}': target
			};
			let msg = client.replaceEach(util.convert.success, obj);
			return message.channel.send({ embeds: [client.blueEmbed(msg)] });
		} catch (error) {
			message.channel.send((error as Error).message);
		}
	}
});
