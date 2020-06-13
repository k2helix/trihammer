const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
const antispam = new db.crearDB('antispam')
module.exports = {
	name: 'antispam',
	description: 'Enable the antispam function',
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
  Model.findOne((f) => f.server === message.guild.id, async (datos) => { 
      
            if (!datos) {
             return  
            } else {
              let permiso = datos.adminrole !== 'none' ? message.member.roles.cache.has(datos.adminrole) : message.member.hasPermission('ADMINISTRATOR')
             if(!permiso) return
             let langcode = datos.lang
             let mrole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'trimuted')

     if(langcode === "es") {
            if(args[0] === "disable") {
        antispam.eliminar(message.guild.id)
        message.channel.send('Ok, he desactivado el sistema antispam')
        if(!mrole) message.channel.send('Necesitas usar una vez el comando mute para que se cree el rol muted.')
            } else {
                antispam.set(message.guild.id, true)
       message.channel.send('Ok, ¡Sistema antispam activado!')
            }
    } else if(langcode === "en") {
      if(args[0] === "disable") {
        antispam.eliminar(message.guild.id)
         message.channel.send('Ok, I have disabled the antispam system')
      } else {
        antispam.set(message.guild.id, true)
    message.channel.send('Ok, the antispam system is enabled!')
    if(!mrole) message.channel.send('You need to use once the mute command to create the muted role.')
      }
        

    }
            }
          });
     
  }
}      