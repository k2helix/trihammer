const Discord = require('discord.js');
const fs = require('fs')
const qdb = require("quick.db");
const db = require('megadb')
let mutesDB = new qdb.table("mutefinalmenteacabado");
const bsonDB = require('bsondb')
module.exports = {
    name: 'mute',
    description: 'mute <user> [time] [reason]',
    aliases: ['tempmute'],
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
             let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
             const key = Math.random().toString(36).substring(2, 15).slice(0, 6)
    let SchemaMute = new bsonDB.Schema({
      key: String,
			id: String,
      server: String,
			tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
		  })
      let Model = new bsonDB.Model("Infracciones", SchemaMute)

        const server = message.guild
        let langcode = datos1.lang

     if(langcode === "es") {
        if(!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("Necesito tener el permiso de **MANAGE_ROLES** Y **MANAGE_CHANNELS**")
      
        let mutedU = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      
        if(!mutedU) return message.channel.send(`Necesitas poner la id del usuario que quieres mutear, no sirve si no está en el servidor`)
        
        if(mutedU.id == client.user.id || mutedU.id == message.author.id) return message.channel.send("No puedo mutear a ese usuario.")
    
       
        let time_v = client.Convert (args[1])
      
        if(!time_v) time_v = "Indefinido"
     
        let mutedR = message.guild.roles.cache.find(r => r.name.toLowerCase() == "trimuted")
       if(!mutedR) {
          message.channel.send('Ok, he creado el rol Muted, vuelve a usar el comando para mutear a alguien').then(() => {
            client.MakeRole(message, "Trimuted", "123456", false)
          })
         setTimeout(() => {
           mutedR = message.guild.roles.cache.find(r => r.name.toLowerCase() == "trimuted")
           
           mutedR.setPosition(message.guild.member(client.user).roles.highest.position - 1)
           message.guild.channels.cache.forEach(f => {
             if(f.type === 'text') {
               f.createOverwrite(mutedR, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
    });
             }
             else if(f.type === 'voice') {
               f.createOverwrite(mutedR, {
        CONNECT: false,
        SPEAK: false
    });
             }
    
    
});
       
         },1000 )
           return  
        } 
        let autor = message.author
        let mencion = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mencion) return message.channel.send('Necesitas poner la id de un usuario') 
      let razon = args.slice(2).join(' ')
      if (time_v === "Indefinido") razon = args.slice(1).join(' ')
      if(!razon) razon = "No se proporcionó ninguna razón"
      if (client.Convert (args[1]) && !mutedU.roles.cache.has(mutedR.id)) {
      const embed4 = new Discord.MessageEmbed()
      .setTitle('Moderación: Mutes')
      .setColor("RANDOM")
      .setDescription(`⚠ Has sido muteado en ${server}`)
      .addField('Razón:', `${razon}`)
      .addField('Tiempo:', `${time_v.nombre}`)
      .setFooter(`Fuiste muteado por: ${autor.tag}`)
      mencion.send(embed4).catch(error => {
       console.log(error)
     })
      }
     if(time_v === "Indefinido" && !mutedU.roles.cache.has(mutedR.id))  {
        const embed5 = new Discord.MessageEmbed()
      .setTitle('Moderación: Mutes')
      .setColor("RANDOM")
      .setDescription(`⚠ Has sido muteado en ${server}`)
      .addField('Razón:', `${razon}`)
      .addField('Tiempo:', `Fuiste muteado indefinidamente`)
      .setFooter(`Fuiste muteado por: ${autor.tag}`) 
     mencion.send(embed5).catch(error => {
       console.log(error)
     })
      }
      

        
        
        if(mutedU.roles.cache.has(mutedR.id)) return message.channel.send(`El usuario ${mutedU.user.tag} ya se encuentra muteado.`)
    //Creamos un Modelo si no se encontró nada
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: mencion.id,
        server: message.guild.id,
        tipo: 'mute',
        time: `${message.createdTimestamp}`,
        duration: time_v === "Indefinido" ? "N/A" : args[1],
        mod: autor.tag,
        reason: razon
			  })
         NuevoGModelo.save().catch(error => console.log(error))
        if (time_v === "Indefinido") mutedU.roles.add(mutedR.id).then(() => {
          message.channel.send(`${mutedU.user.tag} (${mutedU.id}) acaba de ser muteado indefinidamente: ${razon}`)
          let expiration = 'indefinido';
    mutesDB.set(`${keye}`, {
      expirationDate: expiration,
      user: mencion.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });
          if(logs_channel)
         logs_channel.send(`:mute: MUTE 
Usuario: ${mutedU.user.tag}
Moderador: ${autor.tag}
ID: ${mutedU.id}
Razón: ${razon}
Tiempo: Indefinido`)
        }).catch(err =>  {
   
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

        else mutedU.roles.add(mutedR.id).then(() => {
         message.channel.send(`${mutedU.user.tag} (${mutedU.id}) acaba de ser muteado durante ${time_v.nombre}: ${razon}`)
          let expiration = Date.now() + time_v.tiempo;
    mutesDB.set(`${keye}`, {
      expirationDate: expiration,
      user: mencion.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });
         if(logs_channel)
         logs_channel.send(`:mute: MUTE TEMPORAL
Usuario: ${mutedU.user.tag}
Moderador: ${autor.tag}
ID: ${mutedU.id}
Razón: ${razon}
Tiempo: ${time_v.nombre}`)


         
          
        }).catch(err =>  {
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

    return;
     } 
    else if (langcode === "en") {
         if(!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("I need the **MANAGE_ROLES** and **MANAGE_CHANNELS** permission")
      
        let mutedU = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      
        if(!mutedU) return message.channel.send(`I need and id of a guild's member`)
        
        if(mutedU.id == client.user.id || mutedU.id == message.author.id) return message.channel.send("I can't mute that user")
    
       
        let time_v = client.eConvert (args[1])
      
        if(!time_v) time_v = "Undefined"
     
        let mutedR = message.guild.roles.cache.find(r => r.name.toLowerCase() == "trimuted");
       if(!mutedR) {
          message.channel.send('Ok, I have created the muted role, use another time the command to mute someone').then(() => {
            client.MakeRole(message, "Trimuted", "123456", false)
          })
         setTimeout(() => {
           mutedR = message.guild.roles.cache.find(r => r.name.toLowerCase() == "trimuted")
           
           mutedR.setPosition(message.guild.member(client.user).roles.highest.position - 1)
           message.guild.channels.cache.forEach(f => {
             if(f.type === 'text') {
               f.createOverwrite(mutedR, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
    });
             }
             else if(f.type === 'voice') {
               f.createOverwrite(mutedR, {
        CONNECT: false,
        SPEAK: false
    });
             }
    
    
});
       
         },1000 )
           return  
        } 
      
        let autor = message.author
        let mencion = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mencion) return message.channel.send('I need you to put a member id') 
      let razon = args.slice(2).join(' ')
      if (time_v === "Undefined") razon = args.slice(1).join(' ')
      if(!razon) razon = "No reason was given"
      if (client.eConvert (args[1]) && !mutedU.roles.cache.has(mutedR.id)) {
      const embed4 = new Discord.MessageEmbed()
      .setTitle('Moderation: Mute')
      .setColor("RANDOM")
      .setDescription(`⚠ You have been muted in ${server}`)
      .addField('Reason:', `${razon}`)
      .addField('Time:', `${time_v.nombre}`)
      .setFooter(`You were muted by: ${autor.tag}`)
      mencion.send(embed4).catch(error => {
       console.log(error)
     })
      }
     if(time_v === "Undefined" && !mutedU.roles.cache.has(mutedR.id))  {
        const embed5 = new Discord.MessageEmbed()
      .setTitle('Moderation: Mute')
      .setColor("RANDOM")
      .setDescription(`⚠ You have been muted in ${server}`)
      .addField('Reason:', `${razon}`)
      .addField('Time:', `Fuiste muteado indefinidamente`)
      .setFooter(`You were muted by: ${autor.tag}`) 
     mencion.send(embed5).catch(error => {
       console.log(error)
     })
      }
      
        
        
        if(mutedU.roles.cache.has(mutedR.id)) return message.channel.send(`The user ${mutedU.user.tag} is already muted`)
         let SchemaMute = new bsonDB.Schema({
      key: String,
            id: String,
      server: String,
            tipo: String,
           duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaMute)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: mencion.id,
        server: message.guild.id,
        tipo: 'mute',
        time: `${message.createdTimestamp}`,
        duration: time_v === "Undefined" ? "N/A" : args[1],
        mod: autor.tag,
        reason: razon
              })
         NuevoGModelo.save().catch(error => console.log(error))
        if (time_v === "Undefinido") mutedU.roles.add(mutedR.id).then(() => {
          message.channel.send(`${mutedU.user.tag} (${mutedU.id}) has been muted: ${razon}`)
          let expiration = 'indefinido';
    mutesDB.set(`${keye}`, {
      expirationDate: expiration,
      user: mencion.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });
          if(logs_channel)
         logs_channel.send(`:mute: MUTE 
User: ${mutedU.user.tag}
Moderator: ${autor.tag}
ID: ${mutedU.id}
Reason: ${razon}
Time: Indefinido`)
        }).catch(err =>  {

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

        else mutedU.roles.add(mutedR.id).then(() => {
         message.channel.send(`${mutedU.user.tag} (${mutedU.id}) has been muted for ${time_v.nombre}: ${razon}`)
          let expiration = Date.now() + time_v.tiempo;
    mutesDB.set(`${keye}`, {
      expirationDate: expiration,
      user: mencion.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });
          if(logs_channel)
         logs_channel.send(`:mute: MUTE TEMPORAL
User: ${mutedU.user.tag}
Moderator: ${autor.tag}
ID: ${mutedU.id}
Reason: ${razon}
Time: ${time_v.nombre}`)
        }).catch(err =>  {
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
    }
            }
          });
          
    
      }
    }