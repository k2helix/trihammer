import { GuildMember } from 'discord.js';
import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { Infrs, ModelInfrs, ModelMutes, ModelServer, Mutes, Server } from '../lib/utils/models';
export default async (client: ExtendedClient, member: GuildMember) => {
	const serverConfig: Server = await ModelServer.findOne({ server: member.guild.id }).lean();
	if (!serverConfig) return;

	const { events } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	const logs_channel = member.guild.channels.cache.get(serverConfig.memberlogs);
	if (!logs_channel || logs_channel.type !== 'GUILD_TEXT') return;

	logs_channel.send({ embeds: [client.redEmbed(events.member.remove(member))] });

	const role = member.guild.roles.cache.find((r) => r.name.toLowerCase() === 'trimuted');
	if (!role) return;
	if (member.roles.cache.has(role.id)) {
		const infrs: Infrs[] = await ModelInfrs.find().lean();
		const mute: Mutes = await ModelMutes.findOne({ server: member.guild.id, id: member.id, active: true });
		if (mute) return;
		const key = infrs.length;
		const newMute = new ModelMutes({
			id: member.id,
			server: member.guild.id,
			active: true,
			expire: Math.floor(Date.now() + 3600000),
			key: key
		});
		await newMute.save();
	}
};
