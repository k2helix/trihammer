const Discord = require('discord.js');
const fs = require('fs')
const db = require('megadb')
const qdb = require("quick.db");
 const mutesDB = new qdb.table("mutefinalmenteacabado");
    const tempbansDB = new qdb.table("tempbans");

const bsonDB = require('bsondb')
module.exports = {
    name: 'modinf',
    description: 'modinf <inf id> <reason> [duration]',
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
             if(!permiso &&  !adminperms) return
              let langcode = datos1.lang
              const numbers = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
              ]
              const key = args[0]
              const lastArgs = args[args.length - 1]
              let reason = args.slice(1).join(' ')
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
                  if(numbers.some(n => args[1].startsWith(n))){
                          Model.findOne((f) => f.key == key && f.server == message.guild.id, (datos) => {
                  if(!datos) { 
                    return message.channel.send(':negative_squared_cross_mark:')
                  }
                  else {
                  let time = client.Convert(lastArgs)
                  let tiempo = client.Convert(datos.duration)
                  if(datos.tipo === "tempban") {
                    let expiration = tempbansDB.get(key).expirationDate
                    tempbansDB.set(`${key}`, {
                expirationDate: Math.floor(expiration - tiempo.tiempo + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              });
                    message.channel.send(':white_check_mark:').then(() => {
                   
                    datos.duration = lastArgs
                    datos.save().catch(error => console.log(error))
                    
                    })
                  }
                    if(datos.tipo === "mute") {
                      let expiration = mutesDB.get(key).expirationDate
                    if(expiration === "indefinido") {
                      mutesDB.set(`${key}`, {
                expirationDate: Math.floor(Date.now() + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                    } else {
                       mutesDB.set(`${key}`, {
                expirationDate: Math.floor(expiration - tiempo.tiempo + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                    }
                       
                      message.channel.send(':white_check_mark:').then(() => {
                      
                    datos.duration = lastArgs
                    datos.save().catch(error => console.log(error))
          
                    })
                      
                    
                    } 
                    if(datos.tipo === "ban") {
                       let time = client.Convert(lastArgs)
                      tempbansDB.set(`${key}`, {
                expirationDate: Math.floor(Date.now() + time),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                      message.channel.send(':white_check_mark:').then(() => {
                      
                    datos.duration = lastArgs
                    datos.tipo = "tempban"
                    datos.save().catch(error => console.log(error))
                    
                    })
                    }
                  
                  
                    
                  }
                  
              });
               
             }
            
             else if(numbers.some(n => lastArgs.startsWith(n))){
                 reason = args.slice(1, args.length - 1).join(' ')
                Model.findOne((f) => f.key == key && f.server == message.guild.id, (datos) => {
                  if(!datos) { 
                    return message.channel.send(':negative_squared_cross_mark:')
                  }
                  else {
                  let time = client.Convert(lastArgs)
                  let tiempo = client.Convert(datos.duration)
                  if(datos.tipo === "tempban") {
                    let expiration = tempbansDB.get(key).expirationDate
                    tempbansDB.set(`${key}`, {
                expirationDate: Math.floor(expiration - tiempo.tiempo + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              });
                    message.channel.send(':white_check_mark:').then(() => {
                      datos.reason = reason
                    datos.duration = lastArgs
                    datos.save().catch(error => console.log(error))
                    
                    })
                  }
                    if(datos.tipo === "mute") {
                      let expiration = mutesDB.get(key).expirationDate
                    if(expiration === "indefinido") {
                      mutesDB.set(`${key}`, {
                expirationDate: Math.floor(Date.now() + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                    } else {
                       mutesDB.set(`${key}`, {
                expirationDate: Math.floor(expiration - tiempo.tiempo + time.tiempo),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                    }
                       
                      message.channel.send(':white_check_mark:').then(() => {
                      datos.reason = reason
                    datos.duration = lastArgs
                    datos.save().catch(error => console.log(error))
          
                    })
                      
                    
                    } 
                    if(datos.tipo === "ban") {
                       let time = client.Convert(lastArgs)
                      tempbansDB.set(`${key}`, {
                expirationDate: Math.floor(Date.now() + time),
                user: datos.id,
                server: message.guild.id,
                key: key,
                notified: false
              }); 
                      message.channel.send(':white_check_mark:').then(() => {
                      datos.reason = reason
                    datos.duration = lastArgs
                    datos.tipo = "tempban"
                    datos.save().catch(error => console.log(error))
                    
                    })
                    }
                  
                  
                    
                  }
                  
              });
                 } else {
             
            Model.findOne((f) => f.key == key && f.server == message.guild.id, (datos) => {
                  if(!datos) { 
                    return message.channel.send(':negative_squared_cross_mark:')
                  }
                  else {
                    datos.reason = reason
                    datos.save().catch(error => console.log(error))
                    message.channel.send(':white_check_mark:')
                  }
                  
              });
                 }
            }
          });
    
  }
}