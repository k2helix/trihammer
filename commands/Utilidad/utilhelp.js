const Discord = require('discord.js')
const bsonDB = require('bsondb')
const db = require('megadb')
module.exports = {
	name: 'utilhelp',
	description: 'Lista de los comandos de utilidad',
	aliases: ['helputil'],
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
help_embed.setTitle("Comandos de Utilidad")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
       help_embed.setDescription(`Puedes usar ${prefix}comando help para recibir ayuda sobre un comando en específico`)
       

help_embed.addField(` ${prefix}info`, "Mira la información de un usuario")
help_embed.addField(` ${prefix}serverinfo`, "Mira la información de un servidor")
help_embed.addField(` ${prefix}avatar`, "Mira tu avatar o el de un usuario")
help_embed.addField(` ${prefix}jumbo`, "Pasa un emoji a imagen")
help_embed.addField(` ${prefix}ping`, "pong")
help_embed.addField(` ${prefix}remindme`, "Añade un recordatorio")
help_embed.addField(` ${prefix}magik`, "Tú pero distorsionado")
help_embed.addField(` ${prefix}sepia`, "Tú pero sepia")
help_embed.addField(` ${prefix}greyscale`, "Tú pero gris")
help_embed.addField(` ${prefix}invert`, "Tú pero al revés")
help_embed.addField(` ${prefix}contrast`, "Tú pero contrastado")
help_embed.addField(` ${prefix}glitch`, "T̶̡͒ú̶̝͂ ̴̡͑p̸̘͒e̴͇̕r̸̺͝o̶̞̓ ̴͇͒g̴̭̈l̴̰̇i̴̞̔ṫ̴̨c̴͌͜ḩ̴̅ḛ̸̽a̶̲̽d̸̙͘o̸̼͂")
help_embed.addField(` ${prefix}time-zone`, "Muestra la hora en la [zona horaria](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) dada")
help_embed.addField(` ${prefix}today-in-history`, "Algo que ocurrió hoy en la historia")
help_embed.addField(` ${prefix}connect4`, "Juega conecta cuatro con un amigo (beta, probablemente tendrá errores)")
help_embed.addField(` ${prefix}horse-race`, "Juega algunas carreras de caballos")
help_embed.addField(` ${prefix}calc`, "Calcula una operación")
help_embed.addField(` ${prefix}say`, "Haz que diga algo")
help_embed.addField("  ឵឵  ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
help_embed.setFooter(" ឵឵ ", `${trunks.displayAvatarURL({dynamic: true})}`)
message.channel.send(help_embed)
    } else if(langcode === "en") {
      let help_embed = new Discord.MessageEmbed()
help_embed.setTitle("Utility Commands")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
      help_embed.setDescription(`You can ${prefix}command for help about an specific command`)

help_embed.addField(` ${prefix}info`, "Information about an user")
help_embed.addField(` ${prefix}serverinfo`, "Information about the current guild")
help_embed.addField(` ${prefix}avatar`, "Avatar of an user")
help_embed.addField(` ${prefix}jumbo`, "Make an emoji bigger")
help_embed.addField(` ${prefix}ping`, "pong")
help_embed.addField(` ${prefix}remindme`, "Add a reminder")
help_embed.addField(` ${prefix}magik`, "You but distort")
help_embed.addField(` ${prefix}sepia`, "You but sepia")
help_embed.addField(` ${prefix}greyscale`, "You but grey")
help_embed.addField(` ${prefix}invert`, "You but inverted")
help_embed.addField(` ${prefix}contrast`, "You but contrasted")
help_embed.addField(` ${prefix}glitch`, "Y̵͙͝o̴̙͂ṷ̵̂ ̶̰̅b̶͙͛u̷̘͊t̴̩́ ̸̙̑g̵̹̅l̴̘̏i̸̝͂t̷͔͝c̶͕̑h̶̖͛e̶̳͐d̸̲̀")
help_embed.addField(` ${prefix}time-zone`, "Show the current time in the given [time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)")
help_embed.addField(` ${prefix}today-in-history`, "Something which happenned today in history")
help_embed.addField(` ${prefix}connect4`, "Play connect four with a friend (beta, it probably has some errors)")
help_embed.addField(` ${prefix}horse-race`, "Play some horse races")
help_embed.addField(` ${prefix}calc`, "Calculator")
help_embed.addField(` ${prefix}say`, "say something")
help_embed.addField("  ឵឵  ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto).
       You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
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