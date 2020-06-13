const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'confighelp',
	description: 'Config',
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
help_embed.setTitle("Comandos")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")

help_embed.addField(` ${prefix}actionlogs`, "Establece el canal de logs de acciones (cada vez que un usuario usa un comando)")
help_embed.addField(` ${prefix}adminrole `, "Establece el rol de administrador")
help_embed.addField(` ${prefix}infrlogs`, "Establece el canal de logs de infracciones (cada vez que alguien sea sancionado)")
help_embed.addField(` ${prefix}memberlogs`, "Establece el canal de logs de miembros (cada vez que un usuario se una, se le añada un rol...)")
help_embed.addField(` ${prefix}messagelogs`, "Establece el canal de logs de mensajes (cada vez que un mensaje es borrado, editado...)")
help_embed.addField(` ${prefix}modrole`, "Establece el rol de moderador")
help_embed.addField(` ${prefix}serverlogs`, "Establece el canal de logs del servidor (cada vez que un canal o rol sea borrado, actualizado, cambie de nombre...)")
help_embed.addField(` ${prefix}voicelogs`, "Establece el canal de logs de voz (cada vez que alguien se una o salga de un canal de voz)")
help_embed.addField(` ${prefix}prefix`, "Cambia el prefijo del bot")
help_embed.addField(` ${prefix}setlang`, "Cambia el idioma (es o en)")
       
help_embed.addField(" ឵឵ ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot) y ver mi lista de comandos pulsando [aquí](https://trihammerdocs.gitbook.io/trihammer/)`)

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
help_embed.setTitle("Commands")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")

help_embed.addField(` ${prefix}actionlogs`, "Set the actions logs channel (every time a command is used)")
help_embed.addField(` ${prefix}adminrole `, "Set the admin role")
help_embed.addField(` ${prefix}infrlogs`, "Set the infractions logs channel (every time a infraction is given)")
help_embed.addField(` ${prefix}memberlogs`, "Set the members logs channel (every time a member joins, leaves, has a new role...)")
help_embed.addField(` ${prefix}messagelogs`, "Set the messages logs channel (every time a message is deleted, updated...)")
help_embed.addField(` ${prefix}modrole`, "Set the moderator role")
help_embed.addField(` ${prefix}serverlogs`, "Set the server logs channel (every time a channel or rol is updated, deleted...)")
help_embed.addField(` ${prefix}voicelogs`, "Set the voice logs channel (every time a member joins or leaves a voice channel)")
help_embed.addField(` ${prefix}prefix`, "Change the prefix")
help_embed.addField(` ${prefix}setlang`, "Change the language (es or en)")
      
help_embed.addField(" ឵឵ ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto).
You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot) and see my list of commands clicking [here](https://trihammerdocs.gitbook.io/trihammer/)`)

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