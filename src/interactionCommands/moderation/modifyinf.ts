/* eslint-disable no-case-declarations */
import Command from '../../lib/structures/Command';
import { ModelInfrs, ModelMutes, ModelTempban } from '../../lib/utils/models';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ChatInputCommandInteraction } from 'discord.js';
export default new Command({
	name: 'modifyinf',
	description: 'Modify an infraction (time and reason)',
	category: 'moderation',
	required_roles: ['MODERATOR'],
	required_perms: ['ManageMessages'],
	async execute(client, interaction, guildConf) {
		const { mod, functions, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const key = (interaction as ChatInputCommandInteraction).options.getString('id')!,
			reason = (interaction as ChatInputCommandInteraction).options.getString('reason'),
			duration = (interaction as ChatInputCommandInteraction).options.getString('duration');

		if (!reason && !duration) return interaction.reply({ embeds: [client.redEmbed(mod.which_edit)], ephemeral: true });

		const infrs = await ModelInfrs.findOne({ key: key, server: interaction.guildId });
		if (!infrs) return interaction.reply({ embeds: [client.redEmbed(music.not_found)] });

		if (duration) {
			let newTime = functions.Convert(duration);
			let currentTime = functions.Convert(infrs.duration);

			switch (infrs.tipo) {
				case 'tempban':
					let tempban = await ModelTempban.findOne({ key: key, server: interaction.guildId });
					let expiration = tempban.expire;
					tempban.expire = Math.floor(expiration - currentTime.tiempo + newTime.tiempo);
					await tempban.save();
					interaction
						.reply({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${duration}`)] })
						.then(async () => {
							infrs.duration = duration;
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
					interaction
						.reply({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${duration}`)] })
						.then(async () => {
							infrs.duration = duration;
							if (reason) infrs.reason = reason;
							infrs.tipo = 'tempban';
							await infrs.save();
						});
					break;
				case 'mute':
					let mute = await ModelMutes.findOne({ key: key, server: interaction.guildId });
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

					interaction
						.reply({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` ${reason ? `Reason: ${reason}` : ''} | Duration ${duration}`)] })
						.then(async () => {
							infrs.duration = duration;
							if (reason) infrs.reason = reason;
							await infrs.save();
						});
					break;
			}
		} else {
			infrs.reason = reason;
			await infrs.save();

			interaction.reply({ embeds: [client.blueEmbed(mod.modinf.replace('{infr}', key) + ` Reason: ${reason}`)] });
		}
	}
});
