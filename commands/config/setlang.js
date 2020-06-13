
    const Discord = require("discord.js");
    const fs = require("fs");
    const db = require('megadb')
    const bsonDB = require('bsondb')
    const ytdl = require ('ytdl-core')
module.exports = {
	name: 'setlang',
  description: 'setlang <es/en>',
  aliases: ["language", "idioma"],
	async execute(client, message, args) {

let idioma = args[0];
if(!idioma) return
if(!["es", "en"].includes(idioma.toLowerCase())) return message.channel.send("Current languages: \`\`es\`\`, \`\`en\`\`")


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
            let rol = args[0]
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
                        lang: idioma
                    })
               NuevoModelo.save().then(data => {
                 message.channel.send(`Ok.`)
               }).catch(error => console.log(error))   
                  } else {
                    let permiso = datos.adminrole !== 'none' ? message.member.roles.cache.has(datos.adminrole) : message.member.hasPermission('ADMINISTRATOR')
                   if(!permiso) return
                   datos.lang = idioma
                   datos.save().then(nuevo_dato => { 
                     if(nuevo_dato.lang === "es") {
                       message.channel.send(`Ok, ahora hablaré español`)
                     } else if(nuevo_dato.lang === "en") {
                      message.channel.send(`Ok, now I will speak English`)
                     }
                   });
                  }
                });
  }
}


      
