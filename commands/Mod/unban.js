const Discord = require('discord.js');
const db = require('megadb')
const bsonDB = require('bsondb')
const fs = require('fs')
module.exports = {
    name: 'unban',
    description: 'unban <user>',
    aliases: ['desban'],
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
             if(!permiso &&  !adminperms) return
             let langcode = datos1.lang
             let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
             if(langcode === "es") {
              if(!args[0]) return message.channel.send("Ingresa la ID del usuario.")
              let id = args[0]
              let autor = message.author
                let razon = args.slice(1).join(" ")
                if(!razon) razon = "No se proporcionó ninguna razón"
              
              if(isNaN(id)) return message.channel.send("Ingresa una ID válida.")
              if(id == client.user.id) return message.channel.send("A mí no prro.")
              if(message.guild.members.cache.get(id)) return message.channel.send("Esa ID le pertenece a uno de los usuarios de este servidor.")
              
              client.users.fetch(id).then(async (usuario) => { 
                 let banusers = await message.guild.fetchBans();
                 if(!banusers.has(usuario.id)) return message.channel.send('Este usuario no se encuentra baneado en este servidor.');
               
                 message.guild.members.unban(usuario.id).then(  () => {
                   message.channel.send(`Usuario desbaneado: ${usuario.tag}`)
                   if(!logs_channel) return
                   logs_channel.send(`:wrench: UNBAN
      Usuario: ${usuario.tag}
      Moderador: ${autor.tag}
      ID: ${usuario.id}
      Razón: ${razon}`)
                  })
              }).catch(error => {
                 message.channel.send("El usuario con esa ID no existe.")
              })
              }
          else if(langcode === "en"){
             if(!args[0]) return message.channel.send("Type the id of the user you want to unban.")
              let id = args[0]
              let autor = message.author
                let razon = args.slice(1).join(" ")
                if(!razon) razon = "No reason given"
              
              if(isNaN(id)) return message.channel.send("Enter a valid ID")
              if(id == client.user.id) return message.channel.send("A mí no prro.")
              if(message.guild.members.cache.get(id)) return message.channel.send("The ID belongs to a member of the guild")
              
              client.users.fetch(id).then(async (usuario) => { 
                 let banusers = await message.guild.fetchBans();
                 if(!banusers.has(usuario.id)) return message.channel.send('The user is not banned from this guild');
               
                 message.guild.members.unban(usuario.id).then(  () => {
                   message.channel.send(`Unbanned user: ${usuario.tag}`)
                   if(!logs_channel) return
                   logs_channel.send(`:wrench: UNBAN
      User: ${usuario.tag}
      Moderator: ${autor.tag}
      ID: ${usuario.id}
      Reason: ${razon}`)
                  })
              }).catch(error => {
                 message.channel.send("The user with that ID does not exist")
              })
              }
            }
          });
     
  
    }
    
  }
    
   