const Discord = require('discord.js');
const db = require('megadb')
const bsonDB = require('bsondb')
const fs = require('fs')
module.exports = {
    name: 'forceban',
    description: 'forceban <user> <reason>',
    aliases: ['hackban'],
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
              let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('BAN_MEMBERS')
             let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('BAN_MEMBERS')
             if(!permiso && !adminperms) return
              let langcode = datos1.lang
              let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
              let mid = args[0];
       

     if(langcode === "es") {
  if(!args[0]) return message.channel.send("Pon la id del usuario que quieras banear")
  let reason = args.slice(1).join(' ');
    if(!reason) reason = "No se proporcionó ningún motivo";
    client.users.fetch(mid).then(id => {
      message.guild.members.ban(id).catch(err => {
        message.channel.send("Fallo al banear al usuario "+id)
        console.log(err)
      })
      message.channel.send(`${id.tag} ha sido baneado permanentemente: ${reason}.`)
     let SchemaFBan = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaFBan)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: id.id,
        server: message.guild.id,
        tipo: 'ban',
   duration: 'N/A',
         time: `${message.createdTimestamp}`,
        mod: message.author.tag,
        reason: reason
              }) 
                NuevoGModelo.save().catch(error => console.log(error))     
      if(!logs_channel) { return}
      else {     
    logs_channel.send(`:hammer: FORCEBAN
  Usuario: ${id.tag}
  Moderador: ${message.author.tag}
  ID: ${id.id}
  Razón: ${reason}`)
    }
    }).catch(() => {
      message.channel.send(`No hay ningún usuario con la id ${mid}.`)
    })

     }
    if(langcode === "en") {
       if(!args[0]) return message.channel.send("Type the id of the member")
  let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason given";
    client.users.fetch(mid).then(id => {
      message.guild.members.ban(id).catch(err => {
        message.channel.send("An unexpected error ocurred: " + err)
        console.log(err)
      })
      message.channel.send(`${id.tag} ha sido baneado permanentemente: ${reason}.`)
      let SchemaFBan = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
        duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaFBan)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: id.id,
        server: message.guild.id,
        tipo: 'ban',
        duration: 'N/A',
        time: `${message.createdTimestamp}`,
        mod: message.author.tag,
        reason: reason
              }) 
                NuevoGModelo.save().catch(error => console.log(error))      
      if(!logs_channel) { return}
      else {     
    logs_channel.send(`:hammer: FORCEBAN
  User: ${id.tag}
  Moderator: ${message.author.tag}
  ID: ${id.id}
  Reason: ${reason}`)
    }
    }).catch(() => {
      message.channel.send(`The user with the id ${mid} does not exist.`)
    })
    }
            }
          });
        
           
                
          }
}