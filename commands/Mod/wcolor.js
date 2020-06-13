const Discord = require('discord.js')
const Canvas = require('canvas')


const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
    name: 'wcolor',
    description: 'wcolor [hexcolor]',
    aliases: ['welcome-color', 'welcomecolor'],
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
  let color = args[0]
  if(!color.startsWith('#')) return
  if(!datos2) {
    let NuevoWModelo = ModelW.buildModel({
      server: message.guild.id,
      color: color,
      canal: message.channel.id,
      image: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
      text: `Welcome to ${message.guild.name}`
  })
  NuevoWModelo.save().then(data => {
    if(langcode === "es") {
      message.channel.send(`Ok, ${message.channel} establecido como canal de bienvenidas y ${color} establecido como color`)
    } else if(langcode === "en") {
      message.channel.send(`Ok, ${message.channel} set as welcome channel and ${color} set as color.`)
    }
  }).catch(error => console.log(error))   
  } else {
    datos2.color = color
    datos2.save().then(nuevo_dato => { 
      if(langcode === "es") {
        message.channel.send(`Ok, ${nuevo_dato.color} establecido como color.`)
      } else if(langcode === "en") {
        message.channel.send(`Ok, ${nuevo_dato.color} set as color.`)
      }
    });

  }
});

        }
      });
    
     
  }
}