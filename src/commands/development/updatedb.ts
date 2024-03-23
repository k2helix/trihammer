import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers, Users } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'updatedb',
	description: 'only admin',
	category: 'unknown',
	async execute(client, message) {
		if (!client.config.administrators.includes(message.author.id)) return;
		message.channel.send('Starting database update');
		let model: Users[] = await ModelUsers.find().lean();
		// let res = await ModelUsers.updateMany(
		// 	{ rimage: 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png' },
		// 	{ rimage: 'assets/default-background.png' }
		// );
		// let i = 'assets/profile/';

		model.forEach((m) => {
			if (m.rimage != 'assets/default-background.png') console.log(m.id, m.pimage);
		});

		// model.forEach((m) => {
		// 	if (m.pimage != 'assets/profile/') console.log(m.id, m.pimage);

		// 	// if (
		// 	// 	m.rimage === 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png' ||
		// 	// 	m.rimage === 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true'
		// 	// )
		// 	// 	m.rimage = 'assets/default-background.png';

		// 	// if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716052349851795496/images.png') i += '1.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716052326154108980/images.png') i += '2.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716052302389313676/images.png') i += '3.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716052163025174588/2Q.png') i += '4.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png') i += '5.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/716052072981856256/abstract-background-3036235_960_720.png') i += '6.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/588140412036841482/715736357892390982/heart-5209050_1920.jpg') i += '7.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/588140412036841482/715736559126708294/ferris-wheel-5228823_1280.png') i += '8.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/588140412036841482/715736136227749942/hall-5215746_1920.jpg') i += '9.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/588140412036841482/715735767481319474/animal-1845263_1920.jpg') i += '10.png';
		// 	// else if (m.pimage === 'https://cdn.discordapp.com/attachments/588140412036841482/715735868434022460/rabbit-542554_1920.jpg') i += '11.png';

		// 	// console.log(m.id, m.pimage, i);
		// 	// if (i != 'assets/profile') m.pimage = i;

		// 	// if (m.pimage === 'https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png') m.pimage = 'assets/blank.png';
		// 	// // @ts-ignore
		// 	// m.save();
		// });

		// message.channel.send(`Database update finished. ${res.nModified} documents modified`);
	}
});
