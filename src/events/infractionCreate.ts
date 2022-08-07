import ExtendedClient from '../lib/structures/Client';
import LanguageFile from '../lib/structures/interfaces/LanguageFile';
import { ModelServer, Server } from '../lib/utils/models';
interface Infraction {
	user: {
		id: string;
		tag: string;
	};
	type: string;
	time: string;
	mod: string;
	reason: string;
	guild: string;
}
export default async (client: ExtendedClient, infr: Infraction) => {
	const serverConfig: Server = await ModelServer.findOne({ server: infr.guild }).lean();
	if (!serverConfig) return;

	const { mod } = (await import(`../lib/utils/lang/${serverConfig.lang}`)) as LanguageFile;

	const guild = client.guilds.cache.get(infr.guild);
	if (!guild) return;

	const channel = guild.channels.cache.get(serverConfig.infrlogs);
	if (!channel || !channel.isTextBased()) return;

	const obj = {
		'{user}': infr.user.tag,
		'{id}': infr.user.id,
		'{infr}': infr.type,
		'{time}': infr.time,
		'{mod}': infr.mod,
		'{reason}': infr.reason
	};

	channel.send({ embeds: [client.whiteEmbed(client.replaceEach(mod.infraction_created, obj))] });
};
