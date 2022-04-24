/* eslint-disable no-case-declarations */
import MessageCommand from '../../lib/structures/MessageCommand';
import { ModelInfrs, ModelMutes, ModelTempban } from '../../lib/utils/models';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
export default new MessageCommand({
	name: 'modinf',
	description: 'Modify an infraction (time and reason)',
	category: 'moderation',
	required_args: [
		{ index: 0, name: 'infraction id', type: 'string' },
		{ index: 1, name: 'duration', type: 'string', optional: true },
		{ index: 2, name: 'reason', type: 'string', optional: true }
	],
	required_roles: ['MODERATOR'],
	required_perms: ['MANAGE_MESSAGES'],
	async execute(client, message, args, guildConf) {
		const { mod, functions } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const key = args[0];
		let reason: string | undefined;

		if (!args[1]) return message.channel.send({ embeds: [client.redEmbed(mod.which_edit)] });

		const infrs = await ModelInfrs.findOne({ key: key, server: message.guildId });
		if (!infrs) return;

		if (!isNaN(Number(args[1].charAt(0)))) {
			reason = args[2] ? args.slice(2).join(' ') : undefined;
			let newTime = functions.Convert(args[1]);
			let currentTime = functions.Convert(infrs.duration);

			if (!newTime) return message.channel.send({ embeds: [client.redEmbed("The reason shall not start with a number, I'm sorry")] });
			switch (infrs.tipo) {
				case 'tempban':
					let tempban = await ModelTempban.findOne({ key: key, server: message.guildId });
					let expiration = tempban.expire;
					tempban.expire = Math.floor(expiration - currentTime.tiempo + newTime.tiempo);
					await tempban.save();
					message.channel
						.send({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`)] })
						.then(async () => {
							infrs.duration = args[1];
							if (reason) infrs.reason = reason;
							await infrs.save();
						});
					break;
				case 'ban':
					let newTempban = new ModelTempban({
						id: infrs.id,
						server: infrs.server,
						active: true,
						expire: Math.floor(Date.now() + newTime.tiempo),
						key: key
					});
					await newTempban.save();
					message.channel
						.send({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`)] })
						.then(async () => {
							infrs.duration = args[1];
							if (reason) infrs.reason = reason;
							infrs.tipo = 'tempban';
							await infrs.save();
						});
					break;
				case 'mute':
					let mute = await ModelMutes.findOne({ key: key, server: message.guildId });
					if (!mute) {
						let newMute = new ModelMutes({
							id: infrs.id,
							server: infrs.server,
							active: true,
							expire: Math.floor(Date.now() + newTime.tiempo),
							key: key
						});
						await newMute.save();
					} else {
						let expiration = mute.expire;
						mute.expire = Math.floor(expiration - currentTime.tiempo + newTime.tiempo);
						await mute.save();
					}

					message.channel
						.send({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${args[1]}`)] })
						.then(async () => {
							infrs.duration = args[1];
							if (reason) infrs.reason = reason;
							await infrs.save();
						});
					break;
			}
		} else {
			reason = args.slice(1).join(' ');
			infrs.reason = reason;
			await infrs.save();

			message.channel.send({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` Reason: ${reason}`)] });
		}
	}
});
