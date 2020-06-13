const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
    name: 'setwelcome',
    description: 'setwelcome [channel]',
    aliases: ['welcome', 'welcomechannel'],
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
            if(!message.member.hasPermission('ADMINISTRATOR')) return
           let NuevoModelo = Model.buildModel({
              server: message.guild.id,
              modrole: 'none',
              adminrole: 'none',
              messagelogs: 'none',
              voicelogs: 'none',
              actionslogs: 'none',
              memberlogs: 'none',
              serverlogs: 'none',
              infrlogs: 'none',
              prefix: 't-',
              lang: 'en'
          })
          
     NuevoModelo.save().then(data => {
       message.channel.send(`Ok.`)
     }).catch(error => console.log(error))   
        } else {
          let permiso = datos.adminrole !== 'none' ? message.member.roles.cache.has(datos.adminrole) : message.member.hasPermission('ADMINISTRATOR')
         if(!permiso) return
         let langcode = datos.lang
        
         let SchemaW = new bsonDB.Schema({
          server: String,
          canal: String,
          color: String,
          image: String,
          text: String
         });
         let ModelW = new bsonDB.Model("Welcomes", SchemaW)
         if(args[0] === "disable") {
          ModelW.remove(modelo => modelo.server == message.guild.id, eliminado => {
            if (!eliminado) {
              return message.channel.send(':negative_squared_cross_mark:')
                        } else {
                          if(langcode === "es") {
                            message.channel.send('Ok, ya no hay canal de bienvenidas')
                          } else if (langcode === "en") {
                            message.channel.send('Ok, I disabled the welcome channel.')
                          }
                          return
                        }
              
            });
            return
          };
ModelW.findOne((f) => f.server === message.guild.id, async (datos2) => { 
  let channel = message.mentions.channels.first() || message.channel
if(!channel) return
if(channel.type !== "text") return message.channel.send("No.")
  if(!datos2) {
    let NuevoWModelo = ModelW.buildModel({
      server: message.guild.id,
      color: '#ffffff',
      canal: channel.id,
      image: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
      text: `Welcome to ${message.guild.name}`
  })
  NuevoWModelo.save().then(data => {
    if(langcode === "es") {
      message.channel.send(`Ok, ${channel} establecido como canal de bienvenidas`)
    } else if(langcode === "en") {
      message.channel.send(`Ok, ${channel} set as welcome channel.`)
    }
  }).catch(error => console.log(error))   
  } else {
    datos2.canal = channel.id
    datos2.save().then(nuevo_dato => { 
      if(langcode === "es") {
        message.channel.send(`Ok, ${channel} establecido como canal de bienvenidas`)
      } else if(langcode === "en") {
        message.channel.send(`Ok, ${channel} set as welcome channel.`)
      }
    });

  }
});

        }
      });
    
     
  }
}