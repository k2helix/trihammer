const Discord = require('discord.js');
const fs = require('fs')
const db = require('megadb')

const bsonDB = require('bsondb')
module.exports = {
    name: 'delinf',
    description: 'delinf <inf id>',
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
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_GUILD')
             if(!permiso) return
              let langcode = datos1.lang
              const key = args[0]
    let Schema = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      time: String,
      duration: String,
      mod: String,
      reason: String
          })
    let Model = new bsonDB.Model("Infracciones", Schema)
  Model.remove((modelo) => modelo.server == message.guild.id && modelo.key === key , (eliminado) => {
        if (!eliminado) {
        return message.channel.send(':negative_squared_cross_mark:')
                  } else {
                    if(langcode === "es") {
                      message.channel.send('Ok, infracción '+key+ ' eliminada.')
                    } else if(langcode === "en") {
                      message.channel.send('Ok, infraction with id '+key+ ' deleted.')
                    }
                   
                  }
        
    });
            }
            });
    
  }
}