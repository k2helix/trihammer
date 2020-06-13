const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'musichelp',
	description: 'Lista de los comandos de música',
	aliases: ['helpmusic'],
	async execute(client, message) {
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
help_embed.setTitle("Comandos de Música")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
       help_embed.setDescription(`Puedes usar ${prefix}comando help para recibir ayuda sobre un comando en específico`)

help_embed.addField(` ${prefix}play`, "Pon una canción")
help_embed.addField(` ${prefix}search`, "Realiza una búsqueda de canciones")
help_embed.addField(` ${prefix}skip`, "Salta una canción")
help_embed.addField(` ${prefix}volume`, "Mira o cambia el volumen actual")
help_embed.addField(` ${prefix}queue`, "Mira la cola")
help_embed.addField(` ${prefix}remove`, "Borra una canción de la cola")
help_embed.addField(` ${prefix}pause`, "Pausa una canción")
help_embed.addField(` ${prefix}resume`, "Despausa una canción")
help_embed.addField(` ${prefix}lyrics`, "Busca la letra de una canción")
help_embed.addField(` ${prefix}loop`, "Pon la cola en loop")
help_embed.addField(` ${prefix}stop`, "Haz que el bot salga del canal de voz")
help_embed.addField(` ${prefix}np`, "Mira la canción que se está reproduciendo actualmente.")
help_embed.addField(" ឵឵ ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
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
    } else if(langcode === "en") {
       let help_embed = new Discord.MessageEmbed()
help_embed.setTitle("Music Commands")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
help_embed.setDescription(`You can ${prefix}command for help about an specific command`)
      
help_embed.addField(` ${prefix}play`, "Play a song or add it to the queue")
help_embed.addField(` ${prefix}search`, "Perform a song search")
help_embed.addField(` ${prefix}skip`, "Skip a song")
help_embed.addField(` ${prefix}volume`, "See or change the current volume")
help_embed.addField(` ${prefix}queue`, "Songs in queue")
help_embed.addField(` ${prefix}remove`, "Remove a song from the queue")
help_embed.addField(` ${prefix}pause`, "Pause a song")
help_embed.addField(` ${prefix}resume`, "Resume a song")
help_embed.addField(` ${prefix}lyrics`, "Search for a song lyrics")
help_embed.addField(` ${prefix}loop`, "Loop the queue")
help_embed.addField(` ${prefix}stop`, "Stop playing songs and the bot will leave the voice channel")
help_embed.addField(` ${prefix}np`, "Song playing now.")
help_embed.addField(" ឵឵ ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto).
      \n You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
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