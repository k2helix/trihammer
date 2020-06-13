const Discord = require('discord.js');
const db = require('megadb')
const bsonDB = require('bsondb')
const fs = require('fs')
module.exports = {
    name: 'ban',
    description: 'ban <user> <reason>',
    aliases: ['permaban'],
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
             const server = message.guild
             
        let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
           let autor = message.author
           let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(langcode === "es") {
               if(!member)
                 return message.channel.send("Por favor pon la id de un miembro válido de este servidor");
               if(!member.bannable) 
                 return message.channel.send("No puedo banear a este usuario");
               let reason = args.slice(1).join(' ');
               if(!reason) reason = "No se proporcionó ningún motivo";
           const embed5 = new Discord.MessageEmbed()
           .setTitle('Moderación: Ban')
           .setColor("RANDOM")
           .setDescription(`⚠ **|** Has sido baneado en ${server}`)
           .addField('Razón:', `${reason}`)
           .setFooter(`Fuiste baneado por: ${autor.tag}`)
           member.send(embed5).catch(error => {
      console.log(error)
    }) 
           if (message.channel.type == "dm") return;
           
               if(!reason) reason = "No se proporcionó ningún motivo";
               let SchemaBan = new bsonDB.Schema({
     key: String,
     id: String,
     server: String,
     tipo: String,
     duration: String,
     time: String,
     mod: String,
     reason: String
         })
     let Model = new bsonDB.Model("Infracciones", SchemaBan)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
       id: member.id,
       server: message.guild.id,
       tipo: 'ban',
       duration: 'N/A',
      time: `${message.createdTimestamp}`,
       mod: autor.tag,
       reason: reason
             }) 
               NuevoGModelo.save().catch(error => console.log(error))     
               
               member.ban(reason)
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
                 message.channel.send(`${member.user.tag} ha sido baneado permanentemente: ${reason}`);
                 if(!logs_channel) return
                 logs_channel.send(`:hammer: BAN
 Usuario: ${member.user.tag}
 Moderador: ${autor.tag}
 ID: ${member.id}
 Razón: ${reason}`)
               }
         else if(langcode === "en"){
           if(!member)
                 return message.channel.send("Type the id of a valid guild's member");
               if(!member.bannable) 
                 return message.channel.send("I can't ban that user");
               let reason = args.slice(1).join(' ');
               if(!reason) reason = "No reason given";
           const embed5 = new Discord.MessageEmbed()
           .setTitle('Moderation: Ban')
           .setColor("RANDOM")
           .setDescription(`⚠ **|** You have been banned from ${server}`)
           .addField('Reason:', `${reason}`)
           .setFooter(`You were banned by: ${autor.tag}`)
           member.send(embed5).catch(error => {
      console.log(error)
    }) 
           if (message.channel.type == "dm") return;
           

                let SchemaBan = new bsonDB.Schema({
     key: String,
     id: String,
     server: String,
     tipo: String,
     duration: String,
     time: String,
     mod: String,
     reason: String
         })
     let Model = new bsonDB.Model("Infracciones", SchemaBan)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
       id: member.id,
       server: message.guild.id,
       tipo: 'ban',
       duration: 'N/A',
       time: `${message.createdTimestamp}`,
       mod: autor.tag,
       reason: reason
             }) 
               NuevoGModelo.save().catch(error => console.log(error))     
               
               
               member.ban(reason)
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
                 message.channel.send(`${member.user.tag} has been permanently banned: ${reason}`);
                 if(!logs_channel) return
                 logs_channel.send(`:hammer: BAN
 User: ${member.user.tag}
 Moderator: ${autor.tag}
 ID: ${member.id}
 Reason: ${reason}`)
         }
       
            }
          });

             
           
           
                
          }
        }