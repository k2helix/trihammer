import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'random',
	description: 'Select a random value',
	category: 'utility',
	required_args: [
		{ index: 0, name: 'value', type: 'string' },
		{ index: 1, name: 'quantity', type: 'number', optional: true }
	],
	async execute(client, message, args) {
		if (args[0].startsWith('member')) {
			let members = await message.guild?.members.fetch();
			let randomMembers = members?.random(parseInt(args[1] || '1'));
			message.channel.send({ embeds: [client.lightBlueEmbed(randomMembers?.map((m) => `<@${m.id}>`).join(', ') || 'No')] });
		} else if (args.join(' ').split(' | ').length > 1) {
			let randomValues = args.join(' ').split(' | ');
			message.channel.send({ embeds: [client.lightBlueEmbed(randomValues[Math.floor(Math.random() * randomValues.length)])] });
		} else if (args[0].startsWith('number')) {
			let [min, max] = args[1].split('-');
			if (isNaN(Number(min)) || isNaN(Number(max))) return;
			message.channel.send({ embeds: [client.lightBlueEmbed(Math.round(Math.random() * (Number(max) - Number(min)) + Number(min)).toString())] });
		}
	}
});
