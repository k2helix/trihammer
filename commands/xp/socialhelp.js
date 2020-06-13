const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'socialhelp',
	description: 'Lista de los comandos sociales',
	aliases: ['xphelp'],
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
help_embed.setTitle("Comandos de XP")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
       help_embed.setDescription(`Puedes usar ${prefix}comando help para recibir ayuda sobre un comando en específico`)

help_embed.addField(` ${prefix}profile`, "Mira tu perfil.")
help_embed.addField(` ${prefix}profile-desc`, "Cambia la descripción de tu perfil")
help_embed.addField(` ${prefix}profile-text`, "Cambia el texto de tu perfil.")
help_embed.addField(` ${prefix}rep`, "Da reputación a un usuario.")
help_embed.addField(` ${prefix}setlevel`, "Establece el nivel de un usuario")
help_embed.addField(` ${prefix}leveledroles`, "Lista de los roles que se consiguen con xp.")
help_embed.addField(` ${prefix}rank`, "Mira tu rango en el servidor.")
help_embed.addField(` ${prefix}top <global>`, 'Obtén el ranking de experiencia del servidor o global.')
help_embed.addField("  ឵឵  ", `Bot desarrollado por [Trunks#8257](https://twitter.com/Trunks8257) y [Serafin#5066](https://twitter.com/SerafinTonto).
Puedes invitarme pulsando [aquí](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
help_embed.setFooter(" ឵឵ ", `${trunks.displayAvatarURL({dynamic: true})}`)
message.channel.send(help_embed)
    } else if(langcode === "en") {
      let help_embed = new Discord.MessageEmbed()
help_embed.setTitle("XP Command")
help_embed.setColor("RANDOM")
help_embed.setThumbnail("https://i.imgur.com/t3UesbC.png")
help_embed.setDescription(`You can ${prefix}command for help about an specific command`)

help_embed.addField(` ${prefix}profile`, "Your profile.")
help_embed.addField(` ${prefix}profile-desc`, "Change the description of your profile")
help_embed.addField(` ${prefix}profile-text`, "Change the text of your profile")
help_embed.addField(` ${prefix}rep`, "Give a reputation point to someone")
help_embed.addField(` ${prefix}setlevel`, "Sets the level of the given user")
help_embed.addField(` ${prefix}leveledroles`, "List of the roles that can be obtained with XP.")
help_embed.addField(` ${prefix}rank`, "Your rank in the server")
help_embed.addField(` ${prefix}top <global>`, 'Rank by level of the members in the server.')
help_embed.addField("  ឵឵  ", `Bot developed by [Trunks#8257](https://twitter.com/Trunks8257) and [Serafin#5066](https://twitter.com/SerafinTonto).
       You can invite me clicking [here](https://discordapp.com/api/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot)`)
help_embed.setFooter(" ឵឵ ", `${trunks.displayAvatarURL({dynamic: true})}`)
message.channel.send(help_embed)
    }
          }
        });
		
}
}