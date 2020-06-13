const Discord = require('discord.js');
const db = require('megadb')
const fs = require('fs')
const bsonDB = require('bsondb')
module.exports = {
    name: 'lock',
    description: 'lock [role || all]',
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
             if(!permiso && !adminperms) return
                  let langcode = datos1.lang
             if(langcode === "es") {
                 if(args[0] === 'all') {
                     let roles = message.guild.roles.cache.filter(r=> r.position < message.guild.me.roles.highest.position)
                    roles.forEach(role => {
                        message.channel.createOverwrite(role, {
                            SEND_MESSAGES: false
                                   });
                     })
                     message.channel.send('El envío de mensajes en este canal ha sido denegado para todos los roles (inferiores al mío)')
                 } else if(args[0]) {
                 let role = message.guild.roles.cache.find(r => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0])
                 message.channel.createOverwrite(role, {
                    SEND_MESSAGES: false
                           });
                 message.channel.send(`El envío de mensajes en este canal ha sido denegado para \`\`${role.name}\`\``)
                 } else if(!args[0]) {
                    let role = message.guild.roles.cache.find(r => r.name === '@everyone')
                    message.channel.createOverwrite(role, {
                       SEND_MESSAGES: false
                              });
                    message.channel.send(`El envío de mensajes en este canal ha sido denegado para \`\`everyone\`\``)
                 }

            }
            else if(langcode === "en"){
                if(args[0] === 'all') {
                    let roles = message.guild.roles.cache.filter(r=> r.position < message.guild.me.roles.highest.position)
                   roles.forEach(role => {
                       message.channel.createOverwrite(role, {
                           SEND_MESSAGES: false
                                  });
                    })
                    message.channel.send('SEND_MESSAGES permission has been denied for all the roles (lower than mine)')
                } else if(args[0]) {
                let role = message.guild.roles.cache.find(r => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0])
                message.channel.createOverwrite(role, {
                   SEND_MESSAGES: false
                          });
                message.channel.send(`SEND_MESSAGES permission has been denied for \`\`${role.name}\`\``)
                } else if(!args[0]) {
                   let role = message.guild.roles.cache.find(r => r.name === '@everyone')
                   message.channel.createOverwrite(role, {
                      SEND_MESSAGES: false
                             });
                   message.channel.send(`SEND_MESSAGES permission has been denied for \`\`everyone\`\``)
                }
            }
        }
    });

  }
        }

          
        