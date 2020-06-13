const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'welcomehelp',
	description: 'Lista de los comandos del bot Trihammer',
  aliases: ['whelp'],
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
             let langcode = datos1.lang
             let prefix = datos1.prefix
             let trunks = client.users.cache.get("461279654158925825")
             if(langcode === "es") {
              let help_embed = new Discord.MessageEmbed()
      help_embed.setTitle("Comandos de bienvenida")
      help_embed.setColor("RANDOM")
      help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
      
      help_embed.addField(` ${prefix}setwelcome <disable>`, "Indica cuál será el canal de bienvenidas, si usas disable deshabilitarás el canal de bienvenidas")
      help_embed.addField(` ${prefix}wimage `, "Indica cuál será la imagen del mensaje de bienvenida")
      help_embed.addField(` ${prefix}wmessage `, "Indica cuál será el mensaje de bienvenida")
      help_embed.addField(` ${prefix}wcolor `, "Indica cuál será el color del texto del mensaje de bienvenida")
      help_embed.addField(" ឵឵ ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
      Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
      
      message.channel.send(help_embed).catch(err =>  {
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
          } else if(langcode === "en") {
              let help_embed = new Discord.MessageEmbed()
      help_embed.setTitle("Welcome Commands")
      help_embed.setColor("RANDOM")
      help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
      
      help_embed.addField(` ${prefix}setwelcome <disable>`, "Choose the welcome channel, of you use disable the welcomechannel will be disabled")
      help_embed.addField(` ${prefix}wimage `, "Choose the welcome image")
      help_embed.addField(` ${prefix}wmessage `, "Choose the welcome message")
      help_embed.addField(` ${prefix}wcolor `, "Choose the welcome hexcolor")
      help_embed.addField(" ឵឵ ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto).
             You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
      
      message.channel.send(help_embed).catch(err =>  {
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
          }
            }
          });


    
  }
}      
      