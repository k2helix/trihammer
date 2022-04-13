const Discord = require('discord.js');
const { queue } = require('../../lib/modules/music');

function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str;
	return str.substr(0, index) + chr + str.substr(index + 1);
}

function Time_convertor(ms) {
	let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((ms % (1000 * 60)) / 1000);

	let obj = { hours: hours, minutes: minutes, seconds: seconds };
	let array = Object.keys(obj);
	let arr = [];
	array.forEach((period) => {
		let value = obj[period];
		if (!value && period === 'hours');
		arr.push((value < 10 ? '0' + value : value).toString());
	});
	return arr.join(':');
}

module.exports = {
	name: 'np',
	description: "See what's playing right now",
	ESdesc: 'Mira qué se está reproduciendo actualmente',
	aliases: ['nowplaying'],
	type: 6,
	execute(client, interaction, guildConf) {
		const serverQueue = queue.get(interaction.guildId);
		const { music } = require(`../../lib/utils/lang/${guildConf.lang}`);

		if (!serverQueue || serverQueue?.leaveTimeout) return interaction.reply({ embeds: [client.redEmbed(music.no_queue)], ephemeral: true });
		let durationMs = serverQueue.songs[0].durationInSec * 1000;

		let seek = serverQueue.songs[0].seek;
		let now = Time_convertor(getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.state.playbackDuration + Number(seek * 1000));
		let porcentaje = Math.floor(((getVoiceConnection(serverQueue.voiceChannel.guildId)!.state.subscription.player.state.playbackDuration + Number(seek * 1000)) / durationMs) * 100);
		let index = Math.floor(porcentaje / 10);
		let string = '▬▬▬▬▬▬▬▬▬▬';
		let position = setCharAt(string, index, ':radio_button:');

		let embed = new Discord.MessageEmbed()
			.setTitle(music.now_playing)
			.setDescription(`**${serverQueue.songs[0].title}**`)
			.setColor('RANDOM')
			.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
			.addField(' ឵឵ ', `[${now} / ${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`, true)
			.addField(`${porcentaje}%`, position, true)
			.addField(music.play.now_playing.requested_by, `<@${serverQueue.songs[0].requested}>`, true);
		interaction.reply({ embeds: [embed] });
	}
};