import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'descprofile',
	description: 'Set you profile description',
	aliases: ['profile-desc', 'profile-description'],
	category: 'social',
	required_args: [{ index: 0, name: 'description', type: 'string' }],
	async execute(client, message, args, guildConf) {
		let text = args.join(' ');
		let global = await ModelUsers.findOne({ id: message.author.id });
		if (!global) {
			let newModel = new ModelUsers({
				id: message.author.id,
				globalxp: 0,
				pimage: 'assets/blank.png',
				rimage: 'assets/default-background.png',
				pdesc: '',
				ptext: 'Bla bla bla...',
				rep: 0,
				cooldown: 0,
				repcooldown: 0
			});
			await newModel.save();
			global = newModel;
		}
		global.pdesc = text;
		await global.save();

		client.commands.get('profile')!.execute(client, message, args, guildConf);
	}
});
