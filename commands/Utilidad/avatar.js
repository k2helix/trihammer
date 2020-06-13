const Discord = require('discord.js');
const db= require('megadb')
const bsonDB = require('bsondb')

module.exports = {
	name: 'avatar',
  description: 'avatar [user]',
  aliases: ['icon', 'pfp'],
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
          let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    if(user === message.member && args[0]) {
      let user = await client.users.fetch(args[0]) 
      let info_embed = new Discord.MessageEmbed()    
      info_embed.setTitle(`${user.tag}`)
      info_embed.setColor("RANDOM")
      info_embed.setDescription(`[Link](${user.displayAvatarURL({dynamic: true})})`)
      info_embed.setImage(user.displayAvatarURL({dynamic: true}))
      message.channel.send(info_embed).catch(err =>  {
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
     } else {
     let info_embed = new Discord.MessageEmbed()   
     info_embed.setTitle(`${user.user.tag}`)
     info_embed.setColor("RANDOM")
     info_embed.setDescription(`[Link](${user.user.displayAvatarURL({dynamic: true})})`)
     info_embed.setImage(user.user.displayAvatarURL({dynamic: true}))
     
     
     message.channel.send(info_embed).catch(err =>  {
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
};