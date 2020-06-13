const db = require('megadb')
const Discord = require('discord.js')
const bsonDB = require('bsondb')
module.exports = {
    name: 'roleadd',
    description: 'roleadd <user> <role name>',
    aliases: ['roles.add'],
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
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_ROLES')
             
             if(!permiso) return
             let langcode = datos1.lang
             if(langcode === "es") {
              if(!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("Necesito el permiso **MANAGE_ROLES** para usar este comando")
              let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
              if(!rMember) return message.channel.send("No ha sido posible encontrar a ese usuario.")
              let gRole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(" ")) || message.guild.roles.cache.get(args[1])
              if(!gRole) return message.channel.send("No ha sido posible encontrar ese rol");
            
              
              if(rMember.roles.cache.has(gRole.id)){
              
                  message.channel.send(`${rMember.user.tag} ya tiene el rol ${gRole.name}`);
                
                
                }else{
                  
            
                 
                  message.channel.send(`${rMember.user.tag} recibió el rol ${gRole.name}.`)
                  rMember.roles.add(gRole).catch(err =>  {
            const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
           const logs = client.channels.cache.get('640548372574371852')
            const embed = new Discord.MessageEmbed()
            .setTitle('Error')
            .setDescription(err)
            .setColor('RED')
            .addField('Código de error', key)
            .addField('Comando', message.content)
            .addField('Usuario', message.author.tag + ` (${message.author.id})`)
            .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
            logs.send(embed)
             if(langcode === "es") {
                    message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
             } else if(langcode === "en") {
               message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
             }
      
          });
                  
                
                };
           }
          else if(langcode === "en") {
             if(!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.channel.send("I need the **MANAGE_ROLES** permission")
              let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
              if(!rMember) return message.channel.send("I couldn't find that user")
              let gRole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(" ")) || message.guild.roles.cache.get(args[1])
              if(!gRole) return message.channel.send("I couldn't find that role");
            
              
              if(rMember.roles.cache.has(gRole.id)){
              
                  message.channel.send(`${rMember.user.tag} already has the role ${gRole.name}`);
                
                
                }else{
                  
            
                  message.channel.send(`${rMember.user.tag} was given the role ${gRole.name}.`)
                  rMember.roles.add(gRole).catch(err =>  {
            const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
           const logs = client.channels.cache.get('640548372574371852')
            const embed = new Discord.MessageEmbed()
            .setTitle('Error')
            .setDescription(err)
            .setColor('RED')
            .addField('Código de error', key)
            .addField('Comando', message.content)
            .addField('Usuario', message.author.tag + ` (${message.author.id})`)
            .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
            logs.send(embed)
             if(langcode === "es") {
                    message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
             } else if(langcode === "en") {
               message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
             }
      
          });
                  
                
                };
          }
            }
          });
     
     
        }
    
  }
