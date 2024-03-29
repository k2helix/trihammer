import { EmbedBuilder } from 'discord.js';
import { queue } from '../../lib/modules/music';
import Command from '../../lib/structures/Command';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

function setCharAt(str: string, index: number, chr: string) {
	if (index > str.length - 1) return str;
	return str.substr(0, index) + chr + str.substr(index + 1);
}

function Time_convertor(ms: number) {
	let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((ms % (1000 * 60)) / 1000);

	let obj = { hours: hours.toString(), minutes: minutes.toString(), seconds: seconds.toString() };
	let array = Object.keys(obj);
	let arr: string[] = [];
	array.forEach((period) => {
		let value = obj[period as 'hours' | 'minutes' | 'seconds'];
		if (value === '0' && period === 'hours') return;
		arr.push(parseInt(value) < 10 ? '0' + value : value);
	});
	return arr.join(':');
}

export default new Command({
	name: 'np',
	description: "See what's playing right now",
	category: 'music',
	async execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!serverQueue || serverQueue.leaveTimeout || !serverQueue.songs[0]) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		let durationMs = serverQueue.songs[0].durationInSec! * 1000;

		let seek = serverQueue.songs[0].seek;
		let playbackDuration = serverQueue.getPlaybackDuration();
		let now = Time_convertor(playbackDuration + Number(seek * 1000));
		let percentage = Math.floor(((playbackDuration + Number(seek * 1000)) / durationMs) * 100);

		let bar = setCharAt('▬▬▬▬▬▬▬▬▬▬', Math.floor(percentage / 10), ':radio_button:');

		let embed = new EmbedBuilder()
			.setTitle(music.now_playing)
			.setDescription(`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`)
			.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
			.addFields(
				{ name: `${now} ${serverQueue.songs[0].durationInSec === 0 ? '' : `/ ${serverQueue.songs[0].duration} (${percentage}%)`}`, value: bar, inline: true },
				{
					name: music.play.now_playing.requested_by,
					value: `${serverQueue.songs[0].requested === 'Autoplay' ? 'Autoplay' : `<@${serverQueue.songs[0].requested}>`}`,
					inline: true
				}
			);
		interaction.reply({ embeds: [embed] });
	}
});
