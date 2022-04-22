import { unit } from 'mathjs';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';
function formatNumber(number: string | number, minimumFractionDigits = 0) {
	return Number.parseFloat(number as string).toLocaleString(undefined, {
		minimumFractionDigits,
		maximumFractionDigits: 2
	});
}
export default new Command({
	name: 'convert',
	description: 'Convert units to other units',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		if (!interaction.isCommand()) return;

		const amount = interaction.options.getString('amount')!;
		const base = interaction.options.getString('base-unit')!;
		const target = interaction.options.getString('target-unit')!;

		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!amount) return interaction.reply({ content: util.convert.need.replace('{prefix}', guildConf.prefix), ephemeral: true });
		try {
			const value = unit(Number(amount), base).toNumber(target);

			let obj = {
				'{amount}': formatNumber(amount),
				'{base}': base,
				'{number}': formatNumber(value),
				'{target}': target
			};
			let msg = client.replaceEach(util.convert.success, obj);
			return interaction.reply({ embeds: [client.blueEmbed(msg)] });
		} catch (error) {
			interaction.reply({ content: (error as Error).message, ephemeral: true });
		}
	}
});
