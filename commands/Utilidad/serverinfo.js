const Discord = require ("discord.js")
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
name: 'serverinfo',
description: 'Información del servidor',
 aliases: ['server', 'server-info'],
async execute(client, message) {
              
  let region = {
    "brazil": ":flag_br: Brasil",
    "eu-central": ":flag_eu: Europa Central",
    "singapore": ":flag_sg: Singapur",
    "us-central": ":flag_us: Centroamérica",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: América Este",
    "us-south": ":flag_us: Sudamérica",
    "us-west": ":flag_us: América Oeste",
    "eu-west": ":flag_eu: Europa Oeste",
    "vip-us-east": ":flag_us: VIP América Este",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Rusia",
    "southafrica": ":flag_za:  Sudáfrica",
    "japan": ":flag_jp:  Japón (mejor región del mundo)"
}; 
let region1 = {
  "india": ":flag_in: Índia",
  "japan": ":flag_jp:  Japón (mejor región del mundo)",
  "brazil": ":flag_br: Brasil",
  "uswest": ":flag_eu: Europa Oeste",
  "hongkong": ":flag_hk: Hong Kong",
  "southafrica": ":flag_za:  Sudáfrica",
  "sydney": ":flag_au: Sydney",
  "europe": ":flag_eu: Europa",
  "singapore": ":flag_sg: Singapur",
  "uscentral": ":flag_us: Centroamérica",
  "ussouth": ":flag_us: Sudamérica",
  "useast": ":flag_us: América Este",
  "russia": ":flag_ru: Rusia"
};
  let eregion = {
    "brazil": ":flag_br: Brazil",
    "eu-central": ":flag_eu: Central Europe",
    "singapore": ":flag_sg: Singapore",
    "us-central": ":flag_us: US Central",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: US East",
    "us-south": ":flag_us: US South",
    "us-west": ":flag_us: US West",
    "eu-west": ":flag_eu: West Europe",
    "vip-us-east": ":flag_us: VIP US East",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Russia",
    "southafrica": ":flag_za:  South Africa",
    "japan": ":flag_jp:  Japan (best region in the world)"
}; 
let eregion1 = {
  "india": ":flag_in: India",
  "japan": ":flag_jp:  Japan (best region in the world)",
  "brazil": ":flag_br: Brazil",
  "uswest": ":flag_eu: West Europe",
  "hongkong": ":flag_hk: Hong Kong",
  "southafrica": ":flag_za:  South Africa",
  "sydney": ":flag_au: Sydney",
  "europe": ":flag_eu: Europe",
  "singapore": ":flag_sg: Singapore",
  "uscentral": ":flag_us: US Central",
  "ussouth": ":flag_us: US South",
  "useast": ":flag_us: US East",
  "russia": ":flag_ru: Russia"
};

    const moment = require('moment');
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
            let serverembed = new Discord.MessageEmbed()
            .setTitle("Información del servidor")
            .setColor('RANDOM')
            .setThumbnail(message.guild.iconURL)
            .addField('❯ Nombre:', `${message.guild.name}`, false)
            .addField('❯ ID:', `${message.guild.id}`, false)
            .addField('❯ Propietario:', `${message.guild.owner.user.tag} - ${message.guild.owner.user.id}`, false)
            .addField(`❯ Creación:`, `${client.convertDate(message.guild.createdTimestamp)}. Hace ${client.T_convertor(Math.floor(Date.now()) - message.guild.createdTimestamp)}`, false)
            .addField("❯ Miembros:", `${message.guild.memberCount} (${message.guild.members.cache.filter(m => m.user.bot).size} bots)`, false)
            .addField('❯ Región', region[message.guild.region] === undefined ? region1[message.guild.region] : region[message.guild.region], false)
            message.channel.send(serverembed).catch(err =>  {
                const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
               const logs = client.channels.cache.get('640548372574371852')
                const embed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription(err)
                .setColor('RED')
                .addField('Código de error', key)
                .addField('Comando', message.content)
                .addField('Usuario', message.author.tag + ` (${message.author.id})`)
                .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
                logs.send(embed)
                 if(langcode === "es") {
                        message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
                 } else if(langcode === "en") {
                   message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
                 }
          
              });
          } else if(langcode === "en") {
            let serverembed = new Discord.MessageEmbed()
            .setTitle("Guild Information")
            .setColor('RANDOM')
            .setThumbnail(message.guild.iconURL)
            .addField('❯ Name:', `${message.guild.name}`, false)
            .addField('❯ ID:', `${message.guild.id}`, false)
            .addField('❯ Owner:', `${message.guild.owner.user.tag} - ${message.guild.owner.user.id}`, false)
            .addField(`❯ Created:`, `${client.econvertDate(message.guild.createdTimestamp)} ~ ${client.eT_convertor(Math.floor(Date.now()) - message.guild.createdTimestamp)} ago`, false)
            .addField("❯ Members:", `${message.guild.memberCount} (${message.guild.members.cache.filter(m => m.user.bot).size} bots)`, false)
            .addField('❯ Region', eregion[message.guild.region] === undefined ? eregion1[message.guild.region] : eregion[message.guild.region], false)
          message.channel.send(serverembed).catch(err =>  {
                const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
               const logs = client.channels.cache.get('640548372574371852')
                const embed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription(err)
                .addField('Código de error', key)
                .addField('Comando', message.content)
                .addField('Usuario', message.author.tag + ` (${message.author.id})`)
                .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
                logs.send(embed)
                 if(langcode === "es") {
                        message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
                 } else if(langcode === "en") {
                   message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
                 }
          
              });
          }
          }
          
        });

 
}
}
