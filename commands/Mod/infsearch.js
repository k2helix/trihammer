const db = require('megadb')
const qdb = require("quick.db");
 const mutesDB = new  qdb.table("mutefinalmenteacabado");
    const tempbansDB = new qdb.table("tempbans");
const bsonDB = require('bsondb')
const Discord = require('discord.js')
module.exports = {
    name: 'infsearch',
        description: 'infsearch <user>',
        aliases: ['inf', 'infractions', 'infrs'],
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

              if(!args[0]) return
              let mencion = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.users.fetch(args[0]) 
     if(langcode === "es") {
       let Schema = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      duration: String,
      tipo: String,
      time: String,
      mod: String,
      reason: String
          })
         let Model = new bsonDB.Model('Infracciones', Schema)
         Model.filter((modelo) => modelo.id === mencion.id && modelo.server === message.guild.id, async (datos) => { 
      if (!datos) {
        return message.channel.send('El usuario proporcionado no tiene infracciones.');
      } else {
        let infr = []
        datos.sort((a, b) => {
          return b.time - a.time 
        })
        
  for(var x in datos) {
    let activo = ""
    if(datos[x].tipo === 'warn') {activo = 'No'}
    if(datos[x].tipo === 'kick') {
      activo = message.guild.members.cache.has(datos[x].id) ? 'No' : 'Sí'
    }
    if(datos[x].tipo === "ban") {
      let banusers = await message.guild.fetchBans();
           if(!banusers.has(datos[x].id)) {activo = 'No'} else {activo = 'Sí'}
    }
    if(datos[x].tipo === "tempban") {
       const tactivo = tempbansDB.get(datos[x].key).notified
      if(tactivo === true) {activo = "No"} else {activo = "Sí"}
    }
     if(datos[x].tipo === "mute") {
    const mactivo = mutesDB.has(datos[x].key) ? mutesDB.get(datos[x].key).notified : 'No'   
    if(mactivo !== 'No') {
        if(mactivo === true) {activo = "No"} else {activo = "Sí"}
    } else {activo = 'No'}
  
     }
    
    
     
         infr.push(`${datos[x].tipo} | ${datos[x].mod} | ${datos[x].reason} | ${datos[x].duration === undefined ? 'N/A' : datos[x].duration} | ${activo} | ${client.convertDate2(Number(datos[x].time))} | ${datos[x].key}`)
      }
        
        message.channel.send(`Infracciones de ${mencion.tag === undefined? mencion.user.tag : mencion.tag}`+'```Tipo | Moderador | Razón | Duración | ¿Activa? | Fecha | ID de la inf \n ------------------------------------\n' + infr.join('\n')+  '```').catch(err =>  {
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
         });
        
     } else if(langcode === "en") {
       let Schema = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      time: String,
      mod: String,
      reason: String
          })
         let Model = new bsonDB.Model('Infracciones', Schema)
         Model.filter((modelo) => modelo.id === mencion.id && modelo.server === message.guild.id, async (datos) => { 
      if (!datos) {
        return message.channel.send("The given user doesn't have infractions.");
      } else {
        let infr = []
        datos.sort((a, b) => {
          return b.time - a.time 
        })
  for(var x in datos) {
        
        let activo = ""
    if(datos[x].tipo === 'warn') {activo = 'No'}
    if(datos[x].tipo === 'kick' || datos[x].tipo === 'ban') {activo = 'Yes'}
    if(datos[x].tipo === "tempban") {
       const tactivo = tempbansDB.get(datos[x].key).notified
      if(tactivo === true) {activo = "No"} else {activo = "Yes"}
    }
 if(datos[x].tipo === "mute") {
    const mactivo = mutesDB.has(datos[x].key) ? mutesDB.get(datos[x].key).notified : 'No'   
    if(mactivo !== 'No') {
        if(mactivo === true) {activo = "No"} else {activo = "Yes"}
    }else {activo = 'No'}
 }
    
          infr.push(`${datos[x].tipo} | ${datos[x].mod} | ${datos[x].reason} | ${datos[x].duration === undefined ? 'N/A' : datos[x].duration} | ${activo} | ${client.convertDate2(Number(datos[x].time))} | ${datos[x].key}`)
        
      }
        
        message.channel.send(`${mencion.tag === undefined? mencion.user.tag : mencion.tag}'s infractions`+'```Type | Moderator | Reason | Duration | Active? | Time | Infraction ID \n ------------------------------------\n' + infr.join('\n') + '```').catch(err =>  {
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
         });
     }
            }
          });
        
        
        }
	}