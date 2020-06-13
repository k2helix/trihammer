const Discord = require("discord.js");
const fs = require("fs");
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
    name: 'modhelp',
    description: 'Lista de los comandos de moderación',
    aliases: ['helpmod'],

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
              let prefix = datos1.prefix
              let trunks = client.users.cache.get("461279654158925825")
  
     if(langcode === "es") {
        let help_embed = new Discord.MessageEmbed()
      help_embed.setTitle("Comandos de Moderación")
      help_embed.setColor("RANDOM")
      help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
       help_embed.setDescription(`Puedes usar ${prefix}comando help para recibir ayuda sobre un comando en específico`)
      

      help_embed.addField(` ${prefix}makembed`, `Haz un embed (para más ayuda usa ${prefix}makembed)`)
      help_embed.addField(` ${prefix}clear`, "Borra los últimos 50 mensajes de el canal")
      help_embed.addField(` ${prefix}cleanuser`, "Borra los mensajes que quieras de un usuario")
      help_embed.addField(` ${prefix}warn`, "Advierte a un usuario ")
      help_embed.addField(` ${prefix}mute`, "Mutea a un usuario")
      help_embed.addField(` ${prefix}unmute`, "Desmutea a un usuario")
      help_embed.addField(` ${prefix}kick`, "Expulsa a un usuario")
      help_embed.addField(` ${prefix}ban`, "Banea a un usuario permanentemente")
      help_embed.addField(` ${prefix}mban || mkick`, "Expulsa o banea a varios usuarios con un comando (el ban es permanente)")
      help_embed.addField(` ${prefix}lock all || rol`, "Deniega el permiso para enviar mensajes al rol everyone, a todos los roles o al especificado")
      help_embed.addField(` ${prefix}unlock all || rol`, "Restablece el permiso para enviar mensajes al rol everyone, a todos los roles o al especificado")
      help_embed.addField(` ${prefix}forceban`, "Banea a un usuario que no esté en el servidor")
      help_embed.addField(` ${prefix}tempban`, "Banea a un usuario temporalmente")
      help_embed.addField(` ${prefix}infsearch`, "Mira las sanciones previas de un usuario")
      help_embed.addField(` ${prefix}delinf`, "Borra una infracción de un usuario")
      help_embed.addField(` ${prefix}modinf`, "Cambia la razón o duración (o ambas) de una sanción")
      help_embed.addField(` ${prefix}unban`, "Desbanea a un usuario que está baneado")
      help_embed.addField(` ${prefix}antispam <disable>`, "Activa o desactiva el sistema antispam")
      help_embed.addField(` ${prefix}roleadd`, "Añade un rol a un usuario")
      help_embed.addField(` ${prefix}roleremove`, "Quita un rol a un usuario")
      help_embed.addField(` ${prefix}leveledroles <remove>`, `Uso: ${prefix}leveledroles <id del rol> <nivel>, para borrar usa ${prefix}leveledroles remove <id del rol> <nivel>`)
      help_embed.addField(` ${prefix}welcomehelp`, "Comandos para la sección de bienvenidas")
      help_embed.addField("  ឵឵  ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
      \n Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
      help_embed.setFooter(" ឵឵ ", `${trunks.displayAvatarURL({dynamic: true})}`)
      message.channel.send(help_embed).catch(err =>  {
      const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
     const logs = client.channels.cache.get('640548372574371852')
      const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(err)
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
    else if(langcode === "en"){
        let help_embed = new Discord.MessageEmbed()
      help_embed.setTitle("Moderation Commands")
      help_embed.setColor("RANDOM")
      help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
      help_embed.setDescription(`You can ${prefix}command for help about an specific command`)
      
      help_embed.addField(` ${prefix}makembed`, `Make an embed (${prefix}makembed for more help)`)
      help_embed.addField(` ${prefix}clear`, "Deletes the last 50 messages of a channel")
      help_embed.addField(` ${prefix}cleanuser`, "Delete the messages from an user")
      help_embed.addField(` ${prefix}warn`, "Warn an user")
      help_embed.addField(` ${prefix}mute`, "Mute an user")
      help_embed.addField(` ${prefix}unmute`, "Unmute an user")
      help_embed.addField(` ${prefix}kick`, "Kick an user")
      help_embed.addField(` ${prefix}ban`, "Ban an user permanently")
      help_embed.addField(` ${prefix}mban || mkick`, "Kick or ban various users in the same command (ban is perma)")
      help_embed.addField(` ${prefix}lock all || rol`, "Deny the SEND_MESSAGES permission to everyone, all the roles or the specified role")
      help_embed.addField(` ${prefix}unlock all || rol`, "Re-establish the SEND_MESSAGES permission to everyone, all the roles or the specified role")
      help_embed.addField(` ${prefix}forceban`, "Ban an user which is not in the guild")
      help_embed.addField(` ${prefix}tempban`, "Ban an user temporally")
      help_embed.addField(` ${prefix}infsearch`, "Previous infractions from an user")
      help_embed.addField(` ${prefix}delinf`, "Deletes an infraction.")
      help_embed.addField(` ${prefix}modinf`, "Changes te reason or the duration (or both) of an infraction.")
      help_embed.addField(` ${prefix}unban`, "Unban a banned user")
      help_embed.addField(` ${prefix}antispam <disable>`, "Enable or disable the antispam system")
      help_embed.addField(` ${prefix}roleadd`, "Add a role to an user")
      help_embed.addField(` ${prefix}roleremove`, "Remove a role from an user")
      help_embed.addField(` ${prefix}leveledroles`, `Usage: ${prefix}leveledroles <role id> <level>, to remove use ${prefix}leveledroles remove <role id> <level>`)
      help_embed.addField(` ${prefix}welcomehelp`, "Commands for the welcome section")
      help_embed.addField("  ឵឵  ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto). You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
      help_embed.setFooter(" ឵឵ ", `${trunks.displayAvatarURL({dynamic: true})}`)
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