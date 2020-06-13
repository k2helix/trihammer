const Discord = require('discord.js');
const db = require('megadb')
const fs = require('fs')
const bsonDB = require('bsondb')
module.exports = {
    name: 'mban',
    description: 'mban <users> -r <reason>',
    aliases: ['multiban'],
	async execute(client, message, args) {
        const server = message.guild
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
                  let r = args.indexOf('-r')
                  let reason = args.slice(r + 1).join(' ')
                  if(r == -1) return message.channel.send('mban <users> -r <reason>')
    args.slice(0, r).forEach(async id => {
      let autor = message.author
                  let member = await client.users.fetch(id)
                   
         if(langcode === "es") {
                  if(!member)
                    return message.channel.send(`El miembro con id ${id} no ha sido encontrado.`)
                  
                const embed6 = new Discord.MessageEmbed()
                .setTitle('Moderación: Bans')
                .setColor("RANDOM")
                .setDescription(`⚠ Has sido baneado en ${server}`)
                .addField('Razón:', `${reason}`)
                .setFooter(`Fuiste baneado por: ${autor.tag}`)
            
              
          let SchemaKick = new bsonDB.Schema({
          key: String,
          id: String,
          server: String,
          tipo: String,
          duration: String,
          time: String,
          mod: String,
          reason: String
              })
             let Model = new bsonDB.Model("Infracciones", SchemaKick)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
            id: member.id,
            server: message.guild.id,
            tipo: 'ban',
            duration: "N/A",
            time: `${message.createdTimestamp}`,
            mod: autor.tag,
            reason: reason
                  }) 
                    NuevoGModelo.save().catch(error => console.log(error))
                     client.users.fetch(id).then(id1 => {
      message.guild.members.ban(id1).catch(err => {
        message.channel.send("Fallo al banear al usuario "+id1)
        console.log(err)
      })
                     })
                      .catch(err =>  {
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
                      
                      if(!logs_channel) return
                      logs_channel.send(`:hammer: BAN
    Usuario: ${member.tag}
    Moderador: ${autor.tag}
    ID: ${member.id}
    Razón: ${reason}`)
                }
                else if(langcode === "en"){
                  
                  if(!member)
                    return message.channel.send(`I couldn't find a member with ${id} as id`)
                
        
                const embed6 = new Discord.MessageEmbed()
                .setTitle('Moderation: Bans')
                .setColor("RANDOM")
                .setDescription(`⚠ You have been banned from ${server}`)
                .addField('Reason:', `${reason}`)
                .setFooter(`You were banned by: ${autor.tag}`)
                member.send(embed6).catch(error => {
           console.log(error)
         }) 
           
                
                   
              let SchemaKick = new bsonDB.Schema({
          key: String,
          id: String,
          server: String,
          tipo: String,
          time: String,
          duration: String,
          mod: String,
          reason: String
              })
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
            id: member.id,
            server: message.guild.id,
            tipo: 'ban',
            duration: "N/A",
            time: `${message.createdTimestamp}`,
            mod: autor.tag,
            reason: reason
                  }) 
                    NuevoGModelo.save().catch(error => console.log(error))
                     client.users.fetch(id).then(id1 => {
      message.guild.members.ban(id1).catch(err => {
        message.channel.send("Error while banning user "+id1)
        console.log(err)
      })
                     })
                      .catch(err =>  {
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
                  
                      if(!logs_channel) return
                      logs_channel.send(`:hammer: BAN
    User: ${member.tag}
    Moderator: ${autor.tag}
    ID: ${member.id}
    Reason: ${reason}`)
                }
              
                             
                             
                             
    });
    message.channel.send(':white_check_mark:')
                }
              });

            }
            

  }
        

          
        