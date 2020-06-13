const Discord = require('discord.js');
const fs = require('fs')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
    name: 'warn',
    description: 'warn <user> <reason>',
    aliases: ['aviso'],
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
                  let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_MESSAGES')
                 let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_MESSAGES')
             if(!permiso &&  !adminperms) return
                 let langcode = datos1.lang
                 let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
                 let mencion = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       
     if(langcode === "es") {
        if(!mencion) return message.channel.send('Pon una id válida')
        let autor = message.author
        let razon = args.slice(1).join(" ")
        if(!razon) return message.channel.send('Pon una razón')
        const embed = new Discord.MessageEmbed()
        .setTitle('Moderación: Advertencias')
        .setColor("RANDOM")
        .setDescription(`⚠ Has sido advertido en ${server}`)
        .addField('Razón:', `${razon}`)
        .setFooter(`Advertencia emitida por: ${autor.tag}`)
        mencion.send(embed).catch(err =>  {
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
       
        let SchemaWarn = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaWarn)
      let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: mencion.id,
        server: message.guild.id,
        tipo: 'warn',
        duration: "N/A",
        time: `${message.createdTimestamp}`,
        mod: autor.tag,
        reason: razon
              })
         NuevoGModelo.save().catch(error => console.log(error))        
        message.channel.send(`${mencion.user.tag} (${mencion.id}) ha sido advertido: ${razon}`)
if(!logs_channel) return
        logs_channel.send(`:warning: ADVERTENCIA
Usuario: ${mencion.user.tag}
Moderador: ${autor.tag}
ID: ${mencion.id}
Razón: ${razon}`)
}
else if(langcode === "en") {
   if(!mencion) return message.channel.send('Type a valid id.')
        let autor = message.author
        let razon = args.slice(1).join(" ")
        if(!razon) return message.channel.send('Type the reason of the warn')
        const embed = new Discord.MessageEmbed()
        .setTitle('Moderation: Warning')
        .setColor("RANDOM")
        .setDescription(`⚠ You have been warned in ${server}`)
        .addField('Reason:', `${razon}`)
        .setFooter(`Warned by: ${autor.tag}`)
        mencion.send(embed).catch(err =>  {
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
         let SchemaWarn = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaWarn)
    let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        key: keye.toString(),
        id: mencion.id,
        server: message.guild.id,
        tipo: "warn",
        duration: "N/A",
        time: `${message.createdTimestamp}`,
        mod: autor.tag,
        reason: razon
              })
         NuevoGModelo.save().catch(error => console.log(error))     
        message.channel.send(`${mencion.user.tag} (${mencion.id}) has been warned: ${razon}`)
if(!logs_channel) return
        logs_channel.send(`:warning: WARNING
User: ${mencion.user.tag}
Moderator: ${autor.tag}
ID: ${mencion.id}
Reason: ${razon}`)
}
                }
              });
        
        
}
}
