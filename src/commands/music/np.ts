import { getVoiceConnection } from '@discordjs/voice';
import Discord from 'discord.js';
import { queue } from '../../lib/modules/music';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

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

export default new MessageCommand({
	name: 'np',
	description: "See what's playing right now",
	aliases: ['nowplaying'],
	category: 'music',
	async execute(client, message, _args, guildConf) {
		const serverQueue = queue.get(message.guildId!);
		const { music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		if (!serverQueue || serverQueue?.leaveTimeout) return message.channel.send({ embeds: [client.redEmbed(music.no_queue)] });
		let durationMs = serverQueue.songs[0].durationInSec! * 1000;

		let seek = serverQueue.songs[0].seek;
		//@ts-ignore
		let now = Time_convertor(getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.state.playbackDuration + Number(seek * 1000));
		let porcentaje = Math.floor(
			//@ts-ignore
			((getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.state.playbackDuration + Number(seek * 1000)) / durationMs) * 100
		);
		let index = Math.floor(porcentaje / 10);
		let string = '▬▬▬▬▬▬▬▬▬▬';
		let position = setCharAt(string, index, ':radio_button:');

		let embed = new Discord.MessageEmbed()
			.setTitle(music.now_playing)
			.setDescription(`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`)
			.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
			.addField(`${now} / ${serverQueue.songs[0].duration} (${porcentaje}%)`, position, true)
			.addField(music.play.now_playing.requested_by, `${serverQueue.songs[0].requested === 'Autoplay' ? 'Autoplay' : `<@${serverQueue.songs[0].requested}>`}`, true);
		message.channel.send({ embeds: [embed] });
	}
});
