const Discord = require("discord.js");
const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
const ytdl = require ('ytdl-core')
module.exports = {
    name: 'serverlogs',
    description: 'serverlogs [channel]',
    aliases: ['server-logs'],
	async execute(client, message, args) {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
    if(!channel) return

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
                        serverlogs: channel.id,
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
                   if(args[0] === "disable") {
                    datos.serverlogs = 'none'
                   }
                   else {datos.serverlogs = channel.id}
                  
                   
                    datos.save().then(nuevo_dato => { 
                        if(args[0] === "disable") {
                            message.channel.send(':white_check_mark:')
                        } else {
                     if(langcode === "es") {
                       message.channel.send(`Ok, canal ${message.guild.channels.cache.get(nuevo_dato.serverlogs).name} establecido como el canal de logs del servidor`)
                     } else if(langcode === "en") {
                      message.channel.send(`Ok, channel ${message.guild.channels.cache.get(nuevo_dato.serverlogs).name} set as server logs channel.`)
                     }
                    }
                   });
                  }
                });
  }
}
