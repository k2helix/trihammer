const fs = require('fs')
const db = require('megadb')
const qdb = require("quick.db");
const bsonDB = require('bsondb')
const Discord = require('discord.js')
 const mutesDB = new qdb.table("mutefinalmenteacabado");
    const tempbansDB = new qdb.table("tempbans");
module.exports = {
    name: 'unmute',
    description: 'unmute <user>',
    aliases: ['desmute'],
	async execute(client, message, args) {
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
              let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_MESSAGES')
             let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_MESSAGES')
             if(!permiso &&  !adminperms) return
             let langcode = datos1.lang
             let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
             let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    
    let Muted = message.guild.roles.cache.find(mute => mute.name.toLowerCase() === "trimuted")
    let autor = message.author
    if(langcode === "es") {
    let razon = args.slice(1).join(" ")
    if(!razon) razon = "No se proporcionó ninguna razón"
     
    if(!user)return message.channel.send("Debes poner la id de alguien")
      if(!user.roles.cache.has(Muted.id)) return message.channel.send(user.user.tag + ' no está muteado')
    
    user.roles.remove(Muted.id).catch(err =>  {
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
    
    
    message.channel.send(`${user.user.tag} ha sido desmuteado`)
    if(!logs_channel) return
    logs_channel.send(`:loud_sound: UNMUTE
Usuario: ${user.user.tag}
Moderador: ${autor.tag}
ID: ${user.id}
Razón: ${razon}`)
    }
    else if(langcode === "en") {
      let razon = args.slice(1).join(" ")
    if(!razon) razon = "No reason given"
    
    if(!permiso) return 
    if(!user)return message.channel.send("Type the id of someone")
    if(!user.roles.cache.has(Muted.id)) return message.channel.send(user.user.tag + " isn't muted")
    user.roles.remove(Muted.id).catch(err =>  {
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
    
    
    message.channel.send(`${user.user.tag} has been unmuted`)
    if(!logs_channel) return
    logs_channel.send(`:loud_sound: UNMUTE
User: ${user.user.tag}
Moderator: ${autor.tag}
ID: ${user.id}
Reason: ${razon}`)
    }
            }
          });
    
    }
}
