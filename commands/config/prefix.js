const Discord = require("discord.js");
const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
const ytdl = require ('ytdl-core')
module.exports = {
    name: 'prefix',
    description: 'prefix [prefix]',
    aliases: ['setprefix'],
	async execute(client, message, args) {
    let prefix = args.join(' ')
    if(!prefix) return

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
                        prefix: prefix,
                        lang: 'en'
                    })
               NuevoModelo.save().then(data => {
                 message.channel.send(`Ok.`)
               }).catch(error => console.log(error))   
                  } else {
                    let permiso = datos.adminrole !== 'none' ? message.member.roles.cache.has(datos.adminrole) : message.member.hasPermission('ADMINISTRATOR')
                   if(!permiso) return
                   let langcode = datos.lang
                   datos.prefix = prefix
                   datos.save().then(nuevo_dato => { 
                     if(langcode === "es") {
                       message.channel.send(`Ok, ${nuevo_dato.prefix} establecido como el nuevo prefijo`)
                     } else if(langcode === "en") {
                      message.channel.send(`Ok, ${nuevo_dato.prefix} set as new prefix`)
                     }
                   });
                  }
                });
  }
}


