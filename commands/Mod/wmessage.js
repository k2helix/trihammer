const Discord = require('discord.js')
const Canvas = require('canvas')


const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
    name: 'wmessage',
    description: 'wmessage <text>',
    aliases: ['welcome-message', 'welcomemessage'],
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

ModelW.findOne((f) => f.server === message.guild.id, async (datos2) => { 
  let texto = args.join(' ')
  if(!texto) return
  if(!datos2) {
    let NuevoWModelo = ModelW.buildModel({
      server: message.guild.id,
      color: '#ffffff',
      canal: message.channel.id,
      image: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
      text: texto
  })
  NuevoWModelo.save().then(data => {
    if(langcode === "es") {
      message.channel.send(`Ok, ${message.channel} establecido como canal de bienvenidas y el texto establecido como texto.`)
    } else if(langcode === "en") {
      message.channel.send(`Ok, ${message.channel} set as welcome channel and text set as text.`)
    }
  }).catch(error => console.log(error))   
  } else {
    datos2.text = texto
    datos2.save().then(nuevo_dato => { 
      if(langcode === "es") {
        message.channel.send(`Ok, texto establecida como texto.`)
      } else if(langcode === "en") {
        message.channel.send(`Ok, texto set as texto.`)
      }
    });

  }
});

        }
      });
    
     
  }
}