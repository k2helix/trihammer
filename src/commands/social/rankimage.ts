import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'rankimage',
	description: 'Set your [rank image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images)',
	aliases: ['rank-image'],
	category: 'social',
	required_args: [{ index: 0, name: 'image', type: 'string' }],
	async execute(client, message, args, guildConf) {
		type image = '1' | '2' | '3' | '4' | '5';
		// let images = {
		// 	'1': 'https://cdn.discordapp.com/attachments/487962590887149603/716052206356529162/images.png',
		// 	'2': 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
		// 	'3': 'https://cdn.discordapp.com/attachments/487962590887149603/716052102463356928/2Q.png',
		// 	'4': 'https://cdn.discordapp.com/attachments/487962590887149603/716052143399895201/9k.png',
		// 	'5': 'https://cdn.discordapp.com/attachments/684154385408065693/715721659486830603/images.png'
		// };
		let images = {
			'1': 'assets/rank/1.png',
			'2': 'assets/rank/2.png',
			'3': 'assets/rank/3.png',
			'4': 'assets/rank/4.png',
			'5': 'assets/rank/5.png'
		};

		let text = args.join(' ');
		if (!images[text as image]) return message.channel.send('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images');
		let global = await ModelUsers.findOne({ id: message.author.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: message.author.id,
				globalxp: 0,
				pimage: 'assets/blank.png',
				rimage: images[text as image],
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
		}
		global.rimage = images[text as image];
		await global.save();

		client.commands.get('rank')!.execute(client, message, args, guildConf);
	}
});
