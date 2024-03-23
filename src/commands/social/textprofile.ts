import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelUsers } from '../../lib/utils/models';
export default new MessageCommand({
	name: 'textprofile',
	description: 'Set your profile text',
	aliases: ['proftext', 'textprof', 'profile-text'],
	category: 'social',
	required_args: [{ index: 0, name: 'text', type: 'string' }],
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
				cooldown: Date.now(),
				repcooldown: Date.now()
			});
			await newModel.save();
			global = newModel;
		}
		global.ptext = text;
		await global.save();

		client.commands.get('profile')!.execute(client, message, args, guildConf);
	}
});
