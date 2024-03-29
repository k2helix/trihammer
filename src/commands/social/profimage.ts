import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'profimage',
	description: 'Set your [profile image](https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images)',
	aliases: ['profile-image', 'profileimage'],
	required_args: [{ index: 0, name: 'image', type: 'string' }],
	category: 'social',
	async execute(client, message, args, guildConf) {
		type image = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';
		// let images = {
		// 	'1': 'https://cdn.discordapp.com/attachments/487962590887149603/716052349851795496/images.png',
		// 	'2': 'https://cdn.discordapp.com/attachments/487962590887149603/716052326154108980/images.png',
		// 	'3': 'https://cdn.discordapp.com/attachments/487962590887149603/716052302389313676/images.png',
		// 	'4': 'https://cdn.discordapp.com/attachments/487962590887149603/716052163025174588/2Q.png',
		// 	'5': 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png',
		// 	'6': 'https://cdn.discordapp.com/attachments/487962590887149603/716052072981856256/abstract-background-3036235_960_720.png',
		// 	'7': 'https://cdn.discordapp.com/attachments/588140412036841482/715736357892390982/heart-5209050_1920.jpg',
		// 	'8': 'https://cdn.discordapp.com/attachments/588140412036841482/715736559126708294/ferris-wheel-5228823_1280.png',
		// 	'9': 'https://cdn.discordapp.com/attachments/588140412036841482/715736136227749942/hall-5215746_1920.jpg',
		// 	'10': 'https://cdn.discordapp.com/attachments/588140412036841482/715735767481319474/animal-1845263_1920.jpg',
		// 	'11': 'https://cdn.discordapp.com/attachments/588140412036841482/715735868434022460/rabbit-542554_1920.jpg'
		// };

		let images = {
			'1': 'assets/profile/1.png',
			'2': 'assets/profile/2.png',
			'3': 'assets/profile/3.png',
			'4': 'assets/profile/4.png',
			'5': 'assets/profile/5.png',
			'6': 'assets/profile/6.png',
			'7': 'assets/profile/7.png',
			'8': 'assets/profile/8.png',
			'9': 'assets/profile/9.png',
			'10': 'assets/profile/10.png',
			'11': 'assets/profile/11.png'
		};

		let text = args.join(' ');
		if (!images[text as image]) return message.channel.send('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images');
		let global = await ModelUsers.findOne({ id: message.author.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: message.author.id,
				globalxp: 0,
				pimage: images[text as image],
				rimage: 'assets/default-background.png',
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
			return;
		}
		global.pimage = images[text as image];
		await global.save();

		client.commands.get('profile')!.execute(client, message, args, guildConf);
	}
});
