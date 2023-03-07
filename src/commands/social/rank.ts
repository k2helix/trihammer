import MessageCommand from '../../lib/structures/MessageCommand';
import { AttachmentBuilder } from 'discord.js';
import { ModelRank, ModelUsers, Rank } from '../../lib/utils/models';
import RankCanvas from '../../lib/structures/interfaces/CanvasInterfaces';

export default new MessageCommand({
	name: 'rank',
	description: 'Get your rank card',
	cooldown: 3,
	category: 'social',
	required_args: [{ index: 0, name: 'user', type: 'member', optional: true }],
	client_perms: ['AttachFiles'],
	async execute(_client, message, args) {
		let user = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || message.member!;
		if (user.user.bot) return;

		let local = await ModelRank.findOne({ id: user.id, server: message.guild!.id }).lean();
		if (!local) {
			let newRankModel = new ModelRank({
				id: message.author.id,
				server: message.guild!.id,
				nivel: 1,
				xp: 0
			});
			await newRankModel.save();
			local = newRankModel;
		}
		let gl = await ModelUsers.findOne({ id: user.id }).lean();
		let url = gl.rimage;
		if (url === 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true')
			url = 'https://cdn.discordapp.com/attachments/487962590887149603/887039987940470804/wallpaper.png';
		let top: Rank[] = await ModelRank.find({ server: message.guild!.id }).lean();
		let position = (element: Rank) => element.id === user.id && element.server === message.guild!.id;

		const rank = new RankCanvas()
			.setAvatar(user.displayAvatarURL({ extension: 'png' }))
			.setBackground('IMAGE', url)
			.setRank(
				top
					.sort((a, b) => {
						return b.nivel - a.nivel || b.xp - a.xp;
					})
					.findIndex(position) + 1
			)
			.setLevel(local.nivel)
			.setCurrentXP(local.xp)
			.setRequiredXP(Math.floor(local.nivel / 0.0081654953837673))
			.setProgressBar('#FFFFFF', 'COLOR')
			.setUsername(user.user.username)
			.setDiscriminator(user.user.discriminator);

		const attachment = new AttachmentBuilder(await rank.build(), { name: 'rank-image.png' });
		message.channel.send({ files: [attachment] });
	}
});
