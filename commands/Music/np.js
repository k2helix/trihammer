const Discord = require('discord.js')
const fs = require('fs')
const ytdl = require('ytdl-core')
const bsonDB = require('bsondb')
const db = require("megadb")
const moment = require('moment')
function Time_convertor (ms) {      
	let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
	let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);
  
  
	let final2 = ""
	if(segundos < 10) segundos = "0" + segundos
	if(minutos < 10) minutos = "0" + minutos
	if(horas < 10) horas = "0" + horas
	if(horas < 1) {
	if(segundos > 0) final2 += segundos > 1 ? `${minutos}:${segundos}` : `${minutos}:${segundos}`
	if(horas > 1){
		if(segundos > 0) final2 += segundos > 1 ? `${horas}:${minutos}:${segundos}` : `${horas}:${minutos}:${segundos}`	
	}
	return final2
	}
}




module.exports = {
	name: 'np',
	description: 'Mira qué se está reproduciendo actualmente',
	aliases: ['nowplaying'],
async	execute(client, message) {

		const serverQueue = client.queue.get(message.guild.id)
		if (!serverQueue) return message.channel.send('Nothing playing now.');
		let durationMs = 0,
  a = 7
  
for (let t of Object.values(serverQueue.songs[0].durationObject)) {
  switch (a) {
	case 7: durationMs += t * 7 * 86400000
    case 6: durationMs += t * 365 * 86400000; break;
    case 5: durationMs += t * 30 * 86400000; break;
    case 4: durationMs += t * 86400000; break;
    case 3: durationMs += t * 3600000; break;
    case 2: durationMs += t * 60000; break;
    case 1: durationMs += t * 1000; break;
  };
  a --;
  
};


		let now = Time_convertor(client.dispatcher.streamTime)
		let porcentaje = Math.floor((client.dispatcher.streamTime / durationMs) * 100)
		let emoji = ":radio_button:▬▬▬▬▬▬▬▬▬"
if(porcentaje === 0) emoji = ":radio_button:▬▬▬▬▬▬▬▬▬"
if(porcentaje < 25) emoji = "▬:radio_button:▬▬▬▬▬▬▬▬"
if(porcentaje === 25) emoji = "▬:radio_button:▬▬▬▬▬▬▬▬"
if(porcentaje < 50 && porcentaje > 25) emoji = "▬▬:radio_button:▬▬▬▬▬▬▬"
if(porcentaje ===50) emoji = "▬▬▬▬:radio_button:▬▬▬▬▬"
if(porcentaje < 75 && porcentaje > 50) emoji = "▬▬▬▬▬:radio_button:▬▬▬▬"
if(porcentaje === 75) emoji = "▬▬▬▬▬▬:radio_button:▬▬▬"
if(porcentaje === 100) emoji = "▬▬▬▬▬▬▬▬▬:radio_button:"
if(porcentaje < 100 && porcentaje > 75) emoji = "▬▬▬▬▬▬▬▬:radio_button:▬"
if(porcentaje > 100) emoji = "▬▬▬▬▬▬▬▬▬   ឵឵  ឵឵  ឵឵  ឵឵     :radio_button:"


let SchemaGuild = new bsonDB.Schema({
	server: String,
	modrole: String,
	adminrole: String,
	messagelogs: String,
	voicelogs: String,
	actionslogs: String,
	memberlogs: String,
	serverlogs: String,
	infrlogs: String,
	prefix: String,
	lang: String
		})
	let Model = new bsonDB.Model("server", SchemaGuild)
Model.findOne((f) => f.server === message.guild.id, async (datos1) => { 
	
		  if (!datos1) {
		   return  
		  } else {
			let langcode = datos1.lang
			if(langcode === "es") {
				let embed = new Discord.MessageEmbed()
				.setTitle("**🎶 Sonando ahora:**")
				.setDescription(`**${serverQueue.songs[0].title}**`)
				.setColor("RANDOM")
				.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
				.addField(" ឵឵ ", `[${now} / ${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`, true)
				.addField(`${porcentaje}%`, emoji, true)
				 message.channel.send(embed);
			 }
			else if(langcode === "en") {
			  let embed = new Discord.MessageEmbed()
				.setTitle("**🎶 Now playing**")
				.setDescription(`**${serverQueue.songs[0].title}**`)
				.setColor("RANDOM")
				.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
				.addField(" ឵឵ ", `[${now} / ${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`, true)
				.addField(`${porcentaje}%`, emoji, true)
				 message.channel.send(embed);
			}
		  }
		});
     
		
 }
}